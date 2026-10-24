#!/usr/bin/env tsx

/**
 * ==============================================================================
 * VARAH SYSTEMS — Local / Staging Admin Seed Script
 * ==============================================================================
 * Creates or updates an admin user with a cryptographically secure PBKDF2 password.
 * Reads credentials from environment variables (defaults to local-only values).
 * Can be run via:
 *   SEED_ADMIN_EMAIL=admin@varah.ai SEED_ADMIN_PASS=... tsx scripts/seed-admin.ts
 */

import { prisma, isDatabaseConfigured } from '../lib/prisma';
import { hashPassword } from '../lib/auth/session';

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@varah.ai';
  const name = process.env.SEED_ADMIN_NAME || 'Dhruv (Founder)';
  const password = process.env.SEED_ADMIN_PASS || 'VarahAdmin2026!';
  const role = (process.env.SEED_ADMIN_ROLE || 'OWNER') as any;

  if (!isDatabaseConfigured()) {
    console.error('[FAIL] Cannot seed admin user: DATABASE_URL is not configured.');
    process.exit(1);
  }

  console.log('Hashing password with PBKDF2-HMAC-SHA256 (600,000 iterations)...');
  const passwordHash = await hashPassword(password);

  console.log(`Upserting admin user (${email}, role: ${role})...`);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      passwordHash,
      isActive: true,
    },
    create: {
      email,
      name,
      role,
      passwordHash,
      isActive: true,
      twoFactorEnabled: false,
    },
  });

  console.log(`✓ Admin user successfully seeded: ${user.email} (ID: ${user.id})`);
}

seedAdmin()
  .catch((err) => {
    console.error('Seed error:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
