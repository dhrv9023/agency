#!/usr/bin/env node

/**
 * ==============================================================================
 * VARAH SYSTEMS — Environment & Security Configuration Auditor (check:env)
 * ==============================================================================
 * Standards:
 *   - Zero npm dependencies (Node.js 18+ built-ins: fs, path, url).
 *   - Evaluates environment variables for both development and --production modes.
 *   - Audits:
 *     1. IP_HASH_SECRET (HMAC-SHA256 salt for privacy-compliant rate limiting)
 *     2. TURNSTILE_SECRET_KEY & NEXT_PUBLIC_TURNSTILE_SITE_KEY (Cloudflare Turnstile)
 *     3. DATABASE_URL & DIRECT_URL (PostgreSQL Prisma connection)
 *     4. Inbound Lead Notification Adapters (Slack webhook & Email notification)
 *     5. AUTH_SECRET (Session security)
 *     6. templates/meta.json (SITE_URL & CONTACT_EMAIL readiness)
 *   - In --production mode, strictly fails (exit 1) on placeholder keys, test keys,
 *     missing secrets, or unconfigured delivery channels.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const IS_PRODUCTION = args.includes('--production') || process.env.NODE_ENV === 'production';

// Naive .env file parser (built-in, zero dependencies)
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    // Strip wrapping quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Remove trailing comments if not quoted
    const commentIdx = val.indexOf('#');
    if (commentIdx !== -1 && !rawLine.includes('"#') && !rawLine.includes("'#")) {
      val = val.slice(0, commentIdx).trim();
    }
    env[key] = val;
  }
  return env;
}

// Merge .env files into process.env if not already set
const envLocal = loadEnvFile(path.join(ROOT_DIR, '.env.local'));
const envMain = loadEnvFile(path.join(ROOT_DIR, '.env'));
const mergedEnv = { ...envMain, ...envLocal, ...process.env };

// Cloudflare Turnstile official test dummy keys from documentation
const OFFICIAL_TURNSTILE_TEST_KEYS = [
  '1x00000000000000000000AA',
  '1x0000000000000000000000000000000AA',
  '2x00000000000000000000AB',
  '2x0000000000000000000000000000000AB',
  '3x00000000000000000000FF',
  '3x0000000000000000000000000000000FF',
];

const DEV_IP_HASH_FALLBACKS = [
  'dev_fallback_ip_hash_secret_do_not_use_in_prod',
  'varah_local_dev_ip_hash_secret_64_bytes_secure_random_hex_key',
  'your-64-char-random-secret-for-ip-hashing-rate-limits',
];

const DEV_AUTH_FALLBACKS = [
  'your-32-byte-ultra-secure-random-secret-key-here',
  'fallback-dev-secret-replace-in-production-minimum-32-chars',
];

const checks = [];

// 1. IP_HASH_SECRET
const ipHashSecret = mergedEnv.IP_HASH_SECRET;
if (!ipHashSecret) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'FAIL',
      details: 'Missing IP_HASH_SECRET. Production requires a unique 64-char hex secret for HMAC-SHA256 IP rate limiting.',
    });
  } else {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'WARN',
      details: 'Using runtime dev fallback string. Set IP_HASH_SECRET in .env for local testing.',
    });
  }
} else if (DEV_IP_HASH_FALLBACKS.includes(ipHashSecret) || ipHashSecret.includes('local_dev') || ipHashSecret.includes('fallback')) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'FAIL',
      details: 'Using development fallback secret in production. Generate a random secret via: openssl rand -hex 32',
    });
  } else {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'PASS',
      details: 'Configured with local development salt.',
    });
  }
} else if (ipHashSecret.length < 32) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'FAIL',
      details: `IP_HASH_SECRET length (${ipHashSecret.length} chars) is under recommended 32 chars for HMAC-SHA256.`,
    });
  } else {
    checks.push({
      category: 'Anti-Abuse / Security',
      variable: 'IP_HASH_SECRET',
      status: 'WARN',
      details: `Length is ${ipHashSecret.length} chars (< 32 chars).`,
    });
  }
} else {
  checks.push({
    category: 'Anti-Abuse / Security',
    variable: 'IP_HASH_SECRET',
    status: 'PASS',
    details: `Configured securely (${ipHashSecret.length} characters).`,
  });
}

// 2. TURNSTILE_SECRET_KEY & NEXT_PUBLIC_TURNSTILE_SITE_KEY
const turnstileSecret = mergedEnv.TURNSTILE_SECRET_KEY;
const turnstileSiteKey = mergedEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

if (!turnstileSecret) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'TURNSTILE_SECRET_KEY',
      status: 'FAIL',
      details: 'TURNSTILE_SECRET_KEY is missing.',
    });
  } else {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'TURNSTILE_SECRET_KEY',
      status: 'WARN',
      details: 'Using official Cloudflare test dummy secret key in development.',
    });
  }
} else if (OFFICIAL_TURNSTILE_TEST_KEYS.includes(turnstileSecret) || turnstileSecret.startsWith('1x000') || turnstileSecret.startsWith('2x000') || turnstileSecret.startsWith('3x000')) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'TURNSTILE_SECRET_KEY',
      status: 'FAIL',
      details: 'Cloudflare Turnstile test dummy secret key detected in production. Production must use real Cloudflare keys.',
    });
  } else {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'TURNSTILE_SECRET_KEY',
      status: 'PASS',
      details: 'Configured with official Cloudflare test dummy secret key.',
    });
  }
} else {
  checks.push({
    category: 'CAPTCHA (Cloudflare)',
    variable: 'TURNSTILE_SECRET_KEY',
    status: 'PASS',
    details: 'Configured with custom secret key.',
  });
}

if (!turnstileSiteKey) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      status: 'FAIL',
      details: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing.',
    });
  } else {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      status: 'WARN',
      details: 'Turnstile site key not set; client will fallback to official test site key.',
    });
  }
} else if (OFFICIAL_TURNSTILE_TEST_KEYS.includes(turnstileSiteKey) || turnstileSiteKey.startsWith('1x000') || turnstileSiteKey.startsWith('2x000')) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      status: 'FAIL',
      details: 'Cloudflare Turnstile test dummy site key detected in production.',
    });
  } else {
    checks.push({
      category: 'CAPTCHA (Cloudflare)',
      variable: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      status: 'PASS',
      details: 'Configured with official Cloudflare test site key.',
    });
  }
} else {
  checks.push({
    category: 'CAPTCHA (Cloudflare)',
    variable: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    status: 'PASS',
    details: 'Configured with custom site key.',
  });
}

// 3. DATABASE_URL
const dbUrl = mergedEnv.DATABASE_URL;
if (!dbUrl) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Database (Prisma)',
      variable: 'DATABASE_URL',
      status: 'FAIL',
      details: 'DATABASE_URL is missing.',
    });
  } else {
    checks.push({
      category: 'Database (Prisma)',
      variable: 'DATABASE_URL',
      status: 'WARN',
      details: 'DATABASE_URL is not set; Prisma queries will fail in runtime without DB.',
    });
  }
} else if (dbUrl.includes('[PASSWORD]') || dbUrl.includes('[REF]') || dbUrl.includes('[REGION]')) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Database (Prisma)',
      variable: 'DATABASE_URL',
      status: 'FAIL',
      details: 'DATABASE_URL contains unconfigured template tokens ([PASSWORD], [REF]).',
    });
  } else {
    checks.push({
      category: 'Database (Prisma)',
      variable: 'DATABASE_URL',
      status: 'WARN',
      details: 'DATABASE_URL contains template placeholders (OK for static dev, required for DB operations).',
    });
  }
} else if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  checks.push({
    category: 'Database (Prisma)',
    variable: 'DATABASE_URL',
    status: 'FAIL',
    details: 'DATABASE_URL must be a valid postgresql:// connection string.',
  });
} else {
  checks.push({
    category: 'Database (Prisma)',
    variable: 'DATABASE_URL',
    status: 'PASS',
    details: 'Valid PostgreSQL connection string configured.',
  });
}

// 4. Notification Channels (Slack & Email)
const slackUrl = mergedEnv.SLACK_WEBHOOK_URL || mergedEnv.SLACK_LEAD_WEBHOOK_URL;
const isSlackConfigured = Boolean(slackUrl && slackUrl.startsWith('https://hooks.slack.com/'));
const emailDryRun = mergedEnv.EMAIL_DRY_RUN !== 'false';
const emailApiKey = mergedEnv.EMAIL_PROVIDER_API_KEY || mergedEnv.SMTP_PASS;
const isEmailLive = !emailDryRun && Boolean(emailApiKey && !emailApiKey.includes('your_api_key'));

if (isSlackConfigured) {
  checks.push({
    category: 'Notifications',
    variable: 'SLACK_WEBHOOK_URL',
    status: 'PASS',
    details: 'Slack incoming webhook configured for lead alerts.',
  });
} else {
  checks.push({
    category: 'Notifications',
    variable: 'SLACK_WEBHOOK_URL',
    status: 'WARN',
    details: 'Unset or placeholder webhook. Leads will record "skipped: not configured".',
  });
}

if (emailDryRun) {
  if (IS_PRODUCTION && !isSlackConfigured) {
    checks.push({
      category: 'Notifications',
      variable: 'EMAIL_DRY_RUN',
      status: 'FAIL',
      details: 'EMAIL_DRY_RUN=true in production while SLACK_WEBHOOK_URL is also unconfigured. Inbound leads will have no live notification channel!',
    });
  } else {
    checks.push({
      category: 'Notifications',
      variable: 'EMAIL_DRY_RUN',
      status: 'PASS',
      details: 'Dry-run mode active (development default; logs metadata only, zero PII).',
    });
  }
} else {
  if (isEmailLive) {
    checks.push({
      category: 'Notifications',
      variable: 'EMAIL_PROVIDER_API_KEY',
      status: 'PASS',
      details: 'Live email provider credentials configured.',
    });
  } else {
    checks.push({
      category: 'Notifications',
      variable: 'EMAIL_PROVIDER_API_KEY',
      status: IS_PRODUCTION ? 'FAIL' : 'WARN',
      details: 'EMAIL_DRY_RUN is false but no live provider API key is set.',
    });
  }
}

// 5. AUTH_SECRET
const authSecret = mergedEnv.AUTH_SECRET;
if (!authSecret) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'FAIL',
      details: 'Missing AUTH_SECRET in production.',
    });
  } else {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'WARN',
      details: 'AUTH_SECRET not set; using development fallback string.',
    });
  }
} else if (DEV_AUTH_FALLBACKS.includes(authSecret)) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'FAIL',
      details: 'Using placeholder AUTH_SECRET in production. Generate a strong key via: openssl rand -base64 32',
    });
  } else {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'PASS',
      details: 'Configured with development placeholder key.',
    });
  }
} else if (authSecret.length < 32) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'FAIL',
      details: `AUTH_SECRET length (${authSecret.length}) is less than required 32 characters.`,
    });
  } else {
    checks.push({
      category: 'Authentication',
      variable: 'AUTH_SECRET',
      status: 'WARN',
      details: `AUTH_SECRET length is ${authSecret.length} chars.`,
    });
  }
} else {
  checks.push({
    category: 'Authentication',
    variable: 'AUTH_SECRET',
    status: 'PASS',
    details: `Configured securely (${authSecret.length} characters).`,
  });
}

// 6. Meta Config Readiness (templates/meta.json)
const metaPath = path.join(ROOT_DIR, 'templates', 'meta.json');
if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const isPlaceholderDomain = !meta.siteUrl || meta.siteUrl.includes('.invalid') || meta.siteUrl.includes('example.com');
    const isPlaceholderEmail = !meta.contactEmail || meta.contactEmail.includes('.invalid') || meta.contactEmail.includes('systems@agency.ai');

    if (isPlaceholderDomain) {
      if (IS_PRODUCTION) {
        checks.push({
          category: 'Domain & Meta',
          variable: 'meta.siteUrl',
          status: 'FAIL',
          details: `SITE_URL in templates/meta.json is '${meta.siteUrl}'. Production requires a real domain.`,
        });
      } else {
        checks.push({
          category: 'Domain & Meta',
          variable: 'meta.siteUrl',
          status: 'PASS',
          details: `Placeholder '${meta.siteUrl}' (expected before domain attachment).`,
        });
      }
    } else {
      checks.push({
        category: 'Domain & Meta',
        variable: 'meta.siteUrl',
        status: 'PASS',
        details: `Configured domain: ${meta.siteUrl}`,
      });
    }

    if (isPlaceholderEmail) {
      if (IS_PRODUCTION) {
        checks.push({
          category: 'Domain & Meta',
          variable: 'meta.contactEmail',
          status: 'FAIL',
          details: `CONTACT_EMAIL in templates/meta.json is '${meta.contactEmail}'. Production requires an active inbox.`,
        });
      } else {
        checks.push({
          category: 'Domain & Meta',
          variable: 'meta.contactEmail',
          status: 'PASS',
          details: `Placeholder '${meta.contactEmail}' (expected before inbox creation).`,
        });
      }
    } else {
      checks.push({
        category: 'Domain & Meta',
        variable: 'meta.contactEmail',
        status: 'PASS',
        details: `Configured inbox: ${meta.contactEmail}`,
      });
    }
  } catch (err) {
    checks.push({
      category: 'Domain & Meta',
      variable: 'templates/meta.json',
      status: 'FAIL',
      details: `Failed to parse templates/meta.json: ${err.message}`,
    });
  }
}

// Print Audit Report
console.log('=============================================================================');
console.log(`VARAH SYSTEMS — Environment & Security Configuration Auditor (${IS_PRODUCTION ? 'PRODUCTION MODE' : 'DEVELOPMENT MODE'})`);
console.log('=============================================================================\n');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

for (const check of checks) {
  const icon = check.status === 'PASS' ? '✓ [PASS]' : check.status === 'WARN' ? '⚠ [WARN]' : '✗ [FAIL]';
  if (check.status === 'PASS') passCount++;
  if (check.status === 'WARN') warnCount++;
  if (check.status === 'FAIL') failCount++;

  console.log(`${icon.padEnd(9)} [${check.category}] ${check.variable}`);
  console.log(`          ${check.details}`);
}

console.log('\n-----------------------------------------------------------------------------');
console.log(`Summary: ${passCount} Passed, ${warnCount} Warnings, ${failCount} Failures`);
console.log('-----------------------------------------------------------------------------');

if (IS_PRODUCTION && failCount > 0) {
  console.error(`\n[!] PRODUCTION GATE FAILED: ${failCount} security/configuration violations must be resolved before deployment.`);
  process.exit(1);
} else if (failCount > 0) {
  console.error(`\n[!] AUDIT FAILED: ${failCount} critical error(s) found.`);
  process.exit(1);
} else {
  console.log(`\n✓ Environment auditor passed successfully for ${IS_PRODUCTION ? 'production' : 'development'}.`);
  process.exit(0);
}
