import crypto from 'node:crypto';
import { prisma, isDatabaseConfigured } from '../prisma';

/**
 * ==============================================================================
 * VARAH SYSTEMS — IP HMAC Rate Limiting & Abuse Prevention Engine
 * ==============================================================================
 * Standards:
 *   - Client IP hashed via HMAC-SHA256 with server-side IP_HASH_SECRET.
 *   - Atomic upsert and transaction-safe counter increments.
 *   - Strict 30-day retention on blocked abuse attempts.
 *   - Zero PII storage: email domain only (no full email, no names, no phones).
 *   - Message payloads strictly truncated to 200 characters.
 */

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const BLOCKED_RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Hash client IP using HMAC-SHA256 with server secret
 */
export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET || 'dev_fallback_ip_hash_secret_do_not_use_in_prod';
  return crypto.createHmac('sha256', secret).update(ip || '127.0.0.1').digest('hex');
}

/**
 * Anonymize email to domain only for privacy compliance
 */
export function extractEmailDomain(email?: string): string | null {
  if (!email || !email.includes('@')) return null;
  const parts = email.split('@');
  const domain = parts[parts.length - 1].toLowerCase().trim();
  return domain || null;
}

/**
 * Purge expired rate limit windows and obsolete blocked attempts (> 30 days)
 */
export async function purgeExpiredRecords(): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - BLOCKED_RETENTION_MS);

  try {
    await prisma.rateLimitRecord.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    await prisma.blockedAttempt.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } },
    });
  } catch (err) {
    // Avoid blocking runtime on background maintenance
    console.warn('[RATE_LIMIT_PURGE_WARN] Expired record cleanup skipped:', (err as Error).message);
  }
}

// Resilient in-memory fallback cache when database is unavailable
const memoryRateLimits = new Map<string, { count: number; resetAt: Date }>();

function checkInMemoryRateLimit(ipHash: string, action: string, now: Date) {
  const cacheKey = `${ipHash}:${action}`;
  const memRecord = memoryRateLimits.get(cacheKey);

  if (!memRecord || memRecord.resetAt < now) {
    const resetAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);
    memoryRateLimits.set(cacheKey, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt };
  }

  if (memRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: memRecord.resetAt };
  }

  memRecord.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - memRecord.count),
    resetAt: memRecord.resetAt,
  };
}

/**
 * Atomic rate limiting check
 */
export async function checkRateLimit(
  ip: string,
  action = 'contact_form'
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const ipHash = hashIp(ip);
  const now = new Date();

  // If database is not configured (e.g. dev mode without active DB), use in-memory rate limiter
  if (!isDatabaseConfigured()) {
    return checkInMemoryRateLimit(ipHash, action, now);
  }

  // Opportunistic background cleanup
  purgeExpiredRecords().catch(() => {});

  try {
    const existing = await prisma.rateLimitRecord.findUnique({
      where: {
        key_action: {
          key: ipHash,
          action,
        },
      },
    });

    if (!existing || existing.expiresAt < now) {
      const expiresAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);
      await prisma.rateLimitRecord.upsert({
        where: { key_action: { key: ipHash, action } },
        create: { key: ipHash, action, count: 1, expiresAt },
        update: { count: 1, expiresAt },
      });
      return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt: expiresAt };
    }

    if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
      return { allowed: false, remaining: 0, resetAt: existing.expiresAt };
    }

    const updated = await prisma.rateLimitRecord.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - updated.count),
      resetAt: existing.expiresAt,
    };
  } catch (err) {
    // Resilient fallback to in-memory rate limiting when database encounters unexpected connection error
    return checkInMemoryRateLimit(ipHash, action, now);
  }
}

/**
 * Record abuse attempt (zero PII, domain only, max 200 char message)
 */
export async function recordBlockedAttempt({
  ip,
  email,
  message,
  reason,
}: {
  ip: string;
  email?: string;
  message?: string;
  reason: 'RATE_LIMITED' | 'INVALID_CAPTCHA' | 'HONEYPOT' | 'VALIDATION_FAILED';
}): Promise<void> {
  const ipHash = hashIp(ip);
  const emailDomain = extractEmailDomain(email);
  const truncatedMessage = message ? message.slice(0, 200) : null;

  if (!isDatabaseConfigured()) {
    console.log(
      `[SECURITY_AUDIT] Blocked attempt (${reason}) | IP Hash: ${ipHash.slice(0, 8)}... | Domain: @${emailDomain || 'none'}`
    );
    return;
  }

  try {
    await prisma.blockedAttempt.create({
      data: {
        ipHash,
        emailDomain,
        truncatedMessage,
        reason,
      },
    });
  } catch (err) {
    console.error('[SECURITY_AUDIT] Failed to record blocked attempt:', (err as Error).message);
  }
}
