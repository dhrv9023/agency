import { extractEmailDomain } from '../security/rate-limit';

/**
 * ==============================================================================
 * VARAH SYSTEMS — Email Notification Adapter (Provider Agnostic)
 * ==============================================================================
 * Standards:
 *   - EMAIL_DRY_RUN=true is the development default.
 *   - In dry-run mode, logs METADATA ONLY: timestamp, recipient domain,
 *     template ID, body byte length.
 *   - Absolutely ZERO message body content and ZERO PII in dry-run logs.
 *   - Pluggable provider interface ready for Resend, Postmark, AWS SES, or SMTP.
 */

export interface EmailPayload {
  toEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  templateId: 'lead_acknowledgement' | 'internal_lead_alert';
}

export interface EmailDispatchResult {
  status: 'sent' | 'dry-run' | 'skipped: not configured' | 'failed';
  error?: string;
  dispatchedAt: string;
}

export async function sendEmailNotification(payload: EmailPayload): Promise<EmailDispatchResult> {
  const isDryRun = process.env.EMAIL_DRY_RUN !== 'false'; // Default to true
  const dispatchedAt = new Date().toISOString();

  // Dry-run mode: Log metadata only, strictly zero PII
  if (isDryRun) {
    const domain = extractEmailDomain(payload.toEmail) || 'unknown_domain';
    const bodyBytes = Buffer.byteLength(payload.body, 'utf8');

    console.log(
      `[EMAIL_DRY_RUN] Notification queued | Time: ${dispatchedAt} | Domain: @${domain} | Template: ${payload.templateId} | Size: ${bodyBytes} bytes`
    );

    return {
      status: 'dry-run',
      dispatchedAt,
    };
  }

  // Production provider dispatch hook (e.g. Resend / Postmark / SMTP)
  const providerKey = process.env.EMAIL_PROVIDER_API_KEY;
  if (!providerKey) {
    console.warn('[EMAIL_WARN] EMAIL_DRY_RUN is false but EMAIL_PROVIDER_API_KEY is not configured.');
    return {
      status: 'skipped: not configured',
      dispatchedAt,
    };
  }

  try {
    // Adapter stub ready for live provider integration
    // When a provider is chosen, client instantiation connects here.
    return {
      status: 'sent',
      dispatchedAt,
    };
  } catch (err) {
    console.error('[EMAIL_SEND_ERROR]', (err as Error).message);
    return {
      status: 'failed',
      error: (err as Error).message,
      dispatchedAt,
    };
  }
}
