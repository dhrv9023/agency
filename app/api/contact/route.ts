import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validations/contact';
import { checkRateLimit, recordBlockedAttempt } from '@/lib/security/rate-limit';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { dispatchLeadNotifications } from '@/lib/notifications';
import metaConfig from '@/templates/meta.json';
import formRules from '@/templates/form-rules.json';

/**
 * ==============================================================================
 * VARAH SYSTEMS — Production Inbound Lead Intake API (Workstream 9)
 * ==============================================================================
 * Features:
 *   - Dynamic CORS gating derived from templates/meta.json (zero hardcoded domains)
 *   - IP HMAC-SHA256 rate limiting (5 req / 15 min) with atomic persistence
 *   - Anti-spam honeypot detection with zero PII audit logging
 *   - Cloudflare Turnstile token validation (rejects test keys in production)
 *   - Zod runtime schema validation matching templates/form-rules.json
 *   - PostgreSQL persistence via Prisma with resilient offline fallback
 *   - Zero-PII dry-run email acknowledgment & non-silent Slack alerting
 *   - Standardized SLA: "We reply within one business day."
 */

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const siteUrl = metaConfig.siteUrl || '';
  const allowedOrigins = [
    siteUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  const isAllowed = allowedOrigins.includes(origin) || !origin;
  const allowOrigin = isAllowed && origin ? origin : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  const clientIp = getClientIp(request);

  try {
    // 1. IP Rate Limiting Guard
    const rateLimit = await checkRateLimit(clientIp, 'contact_form');
    if (!rateLimit.allowed) {
      await recordBlockedAttempt({
        ip: clientIp,
        reason: 'RATE_LIMITED',
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait 15 minutes before submitting another inquiry.',
        },
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse Request Body
    let rawBody: Record<string, any> = {};
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      rawBody = await request.json().catch(() => ({}));
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      rawBody = Object.fromEntries(formData.entries());
    } else {
      rawBody = await request.json().catch(() => ({}));
    }

    // 3. Honeypot Anti-Bot Guard
    if (rawBody.website_hp && String(rawBody.website_hp).trim().length > 0) {
      await recordBlockedAttempt({
        ip: clientIp,
        email: rawBody.email,
        message: rawBody.message,
        reason: 'HONEYPOT',
      });

      // Return synthetic success to confuse scraping bots
      return NextResponse.json(
        {
          success: true,
          id: `lead_hp_${Date.now().toString(36)}`,
          message: formRules.constants.responseSla,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // 4. Cloudflare Turnstile Verification
    const turnstileResult = await verifyTurnstileToken({
      token: rawBody.turnstileToken,
      remoteIp: clientIp,
    });

    if (!turnstileResult.success) {
      await recordBlockedAttempt({
        ip: clientIp,
        email: rawBody.email,
        message: rawBody.message,
        reason: 'INVALID_CAPTCHA',
      });

      return NextResponse.json(
        {
          success: false,
          error: turnstileResult.error || 'Security verification failed. Please refresh and retry.',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 5. Zod Schema Validation
    const validationResult = contactFormSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      await recordBlockedAttempt({
        ip: clientIp,
        email: rawBody.email,
        message: rawBody.message,
        reason: 'VALIDATION_FAILED',
      });

      return NextResponse.json(
        {
          success: false,
          error: firstIssue ? firstIssue.message : 'Please check your form entries and retry.',
          issues: validationResult.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const validData = validationResult.data;

    // Consent-Gated Attribution Processing (Workstream 11)
    // Attribution is strictly nulled if analytics consent is not granted
    let utmSource: string | null = null;
    let utmMedium: string | null = null;
    let utmCampaign: string | null = null;
    let utmTerm: string | null = null;
    let utmContent: string | null = null;
    let landingPath: string | null = null;
    let referrerUrl: string | null = null;

    if (validData.analyticsConsented) {
      utmSource = validData.utmSource || null;
      utmMedium = validData.utmMedium || null;
      utmCampaign = validData.utmCampaign || null;
      utmTerm = validData.utmTerm || null;
      utmContent = validData.utmContent || null;
      landingPath = validData.landingPath || null;

      if (validData.referrerUrl) {
        try {
          const parsed = new URL(validData.referrerUrl);
          // Strictly origin + pathname, stripping query parameters and fragment
          referrerUrl = `${parsed.origin}${parsed.pathname}`.slice(0, 200);
        } catch {
          referrerUrl = null;
        }
      }
    }

    // 6. Database Persistence via Prisma
    const isProduction = process.env.NODE_ENV === 'production';
    let leadId = `lead_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    let dbPersisted = false;

    // In production, an unconfigured database must fail loudly (503 Service Unavailable)
    if (isProduction && !isDatabaseConfigured()) {
      console.error('[LEAD_DB_CRITICAL] DATABASE_URL is not configured in production environment.');
      return NextResponse.json(
        {
          success: false,
          error: 'Our inquiry intake service is temporarily unavailable due to a database configuration issue. Please email us directly.',
        },
        { status: 503, headers: corsHeaders }
      );
    }

    if (isDatabaseConfigured()) {
      try {
        const createdLead = await prisma.lead.create({
          data: {
            name: validData.name,
            email: validData.email,
            company: validData.company,
            website: validData.website || null,
            budgetRange: validData.budgetRange || null,
            serviceInterest: validData.serviceInterest || 'AI Automation Workflows',
            message: validData.message,
            preferredTimes: validData.preferredTimes || null,
            stage: 'NEW',
            priority: 'MEDIUM',
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            landingPath,
            referrerUrl,
            convertedOnPage: validData.convertedOnPage,
            emailNotificationStatus: 'pending',
            slackNotificationStatus: 'pending',
          },
        });

        leadId = createdLead.id;
        dbPersisted = true;
      } catch (dbErr) {
        console.error('[LEAD_DB_OFFLINE] Lead persistence error:', (dbErr as Error).message);
        // In production, database persistence failures must fail loudly (500 Internal Server Error)
        if (isProduction) {
          return NextResponse.json(
            {
              success: false,
              error: 'A database error occurred while saving your inquiry. Please try again or reach out to us directly.',
            },
            { status: 500, headers: corsHeaders }
          );
        }
      }
    }

    // 7. Notification Dispatch (Dry-Run Email & Non-Silent Slack)
    const notificationResult = await dispatchLeadNotifications({
      leadId,
      name: validData.name,
      email: validData.email,
      company: validData.company,
      message: validData.message,
      serviceInterest: validData.serviceInterest || 'AI Automation Workflows',
      budgetRange: validData.budgetRange || 'Not specified',
      preferredTimes: validData.preferredTimes,
      convertedOnPage: validData.convertedOnPage,
    });

    // Update notification status on database record if persisted
    if (dbPersisted) {
      await prisma.lead
        .update({
          where: { id: leadId },
          data: {
            emailNotificationStatus: notificationResult.emailStatus,
            slackNotificationStatus: notificationResult.slackStatus,
          },
        })
        .catch((err) => {
          console.warn('[LEAD_UPDATE_WARN] Failed to update lead notification status:', (err as Error).message);
        });
    }

    return NextResponse.json(
      {
        success: true,
        id: leadId,
        message: 'Project scoping inquiry received successfully.',
        responseSla: formRules.constants.responseSla,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[API_CONTACT_CRITICAL_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal error occurred while processing your request. Please try again later.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
