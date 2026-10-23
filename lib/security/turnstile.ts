/**
 * ==============================================================================
 * VARAH SYSTEMS — Cloudflare Turnstile Verification Engine
 * ==============================================================================
 * Official Cloudflare Turnstile verification with production security enforcement.
 * Rejects official test dummy keys when NODE_ENV === 'production'.
 */

const CF_VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Cloudflare official test dummy secret keys from documentation
export const OFFICIAL_TURNSTILE_TEST_KEYS = {
  ALWAYS_PASS_SITEKEY: '1x00000000000000000000AA',
  ALWAYS_PASS_SECRET: '1x0000000000000000000000000000000AA',
  ALWAYS_BLOCK_SITEKEY: '2x00000000000000000000AB',
  ALWAYS_BLOCK_SECRET: '2x0000000000000000000000000000000AB',
};

const TEST_SECRET_KEYS = [
  OFFICIAL_TURNSTILE_TEST_KEYS.ALWAYS_PASS_SECRET,
  OFFICIAL_TURNSTILE_TEST_KEYS.ALWAYS_BLOCK_SECRET,
  '3x0000000000000000000000000000000FF',
];

export async function verifyTurnstileToken({
  token,
  remoteIp,
}: {
  token?: string;
  remoteIp?: string;
}): Promise<{ success: boolean; error?: string }> {
  const isProduction = process.env.NODE_ENV === 'production';
  const secretKey = process.env.TURNSTILE_SECRET_KEY || OFFICIAL_TURNSTILE_TEST_KEYS.ALWAYS_PASS_SECRET;

  // In production, strictly reject test keys
  if (isProduction && TEST_SECRET_KEYS.includes(secretKey)) {
    console.error('[SECURITY_VIOLATION] Production environment cannot use Cloudflare Turnstile test secret key!');
    return {
      success: false,
      error: 'Security configuration error: Cloudflare Turnstile test keys are prohibited in production.',
    };
  }

  // Handle missing token
  if (!token) {
    // Permitted in non-production local dev if explicitly bypassed or dry-run
    if (!isProduction && process.env.SKIP_TURNSTILE_DEV === 'true') {
      return { success: true };
    }
    return {
      success: false,
      error: 'Security challenge verification token missing. Please interact with the form to verify.',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch(CF_VERIFY_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await res.json().catch(() => ({ success: false }));

    if (!data.success) {
      const errorCodes = data['error-codes'] ? data['error-codes'].join(', ') : 'Verification failed';
      return {
        success: false,
        error: `Security verification failed (${errorCodes}). Please retry.`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[TURNSTILE_NETWORK_ERROR]', (err as Error).message);
    return {
      success: false,
      error: 'Security verification service temporarily unreachable. Please retry.',
    };
  }
}
