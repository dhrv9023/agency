'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: AUTHENTICATION
 * Secure login, credential verification, RBAC role assignment, and logout
 * ==============================================================================
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, destroySession, getSession, verifyPassword } from '@/lib/auth/session';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security/rate-limit';
import type { AdminUser, UserRole } from '@/types/admin';

// Demo seed accounts strictly confined to local development testing
const DEV_DEMO_ACCOUNTS: Record<string, { role: UserRole; name: string }> = {
  'admin@varah.ai': { role: 'OWNER', name: 'Dhruv & Bhavya (Founders)' },
  'ops@varah.ai': { role: 'ADMIN', name: 'DevOps & Systems Lead' },
  'content@varah.ai': { role: 'EDITOR', name: 'Content & CMS Lead' },
  'auditor@varah.ai': { role: 'VIEWER', name: 'Compliance Auditor' },
};

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AdminUser;
}

/**
 * Server action to authenticate admin credentials and issue secure session cookie
 */
export async function loginAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  // Rate Limiting Guard on Login Attempts
  let clientIp = '127.0.0.1';
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get('x-forwarded-for');
    clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  } catch {
    // Edge/SSR fallback
  }

  const rateLimit = await checkRateLimit(clientIp, 'admin_login');
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: 'Too many failed login attempts. Please wait 15 minutes before retrying.',
    };
  }

  // Minimum password length check
  if (password.length < 6) {
    return { success: false, error: 'Invalid password. Must contain at least 6 characters.' };
  }

  let authenticatedUser: AdminUser | null = null;

  if (isProduction) {
    // In production, mock and demo credentials are strictly prohibited
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        error: 'Database unconfigured. Admin console access is disabled in production.',
      };
    }

    try {
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!dbUser || !dbUser.isActive || !dbUser.passwordHash) {
        return { success: false, error: 'Invalid email or password.' };
      }

      const isValid = await verifyPassword(password, dbUser.passwordHash);
      if (!isValid) {
        return { success: false, error: 'Invalid email or password.' };
      }

      authenticatedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl ?? null,
        role: dbUser.role as UserRole,
        isActive: dbUser.isActive,
        twoFactorEnabled: Boolean(dbUser.twoFactorEnabled),
        lastLoginAt: new Date().toISOString(),
        createdAt: dbUser.createdAt.toISOString(),
        updatedAt: dbUser.updatedAt.toISOString(),
      };

      // Opportunistically update lastLoginAt
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { lastLoginAt: new Date() },
      }).catch(() => {});
    } catch (err: unknown) {
      console.error('[AUTH_DB_ERROR]', (err as Error).message);
      return { success: false, error: 'Authentication service encountered a database error.' };
    }
  } else {
    // Local development fallback
    if (isDatabaseConfigured()) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser && dbUser.passwordHash) {
          const isValid = await verifyPassword(password, dbUser.passwordHash);
          if (isValid) {
            authenticatedUser = {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              avatarUrl: dbUser.avatarUrl ?? null,
              role: dbUser.role as UserRole,
              isActive: dbUser.isActive,
              twoFactorEnabled: Boolean(dbUser.twoFactorEnabled),
              lastLoginAt: new Date().toISOString(),
              createdAt: dbUser.createdAt.toISOString(),
              updatedAt: dbUser.updatedAt.toISOString(),
            };
          }
        }
      } catch {
        // Fall back to demo accounts if local db offline
      }
    }

    if (!authenticatedUser) {
      const demoAccount = DEV_DEMO_ACCOUNTS[email];
      const targetRole = (formData.get('role') as UserRole) || 'OWNER';
      const role: UserRole = demoAccount ? demoAccount.role : targetRole;
      const name: string = demoAccount ? demoAccount.name : 'Authorized Operator';

      authenticatedUser = {
        id: `usr_${role.toLowerCase()}_${Date.now().toString(36)}`,
        email,
        name,
        avatarUrl: null,
        role,
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  if (!authenticatedUser) {
    return { success: false, error: 'Authentication failed. Please verify credentials.' };
  }

  try {
    await createSession(authenticatedUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Session creation error';
    return { success: false, error: `Authentication failed: ${message}` };
  }

  return { success: true, user: authenticatedUser };
}

/**
 * Server action to terminate active session and redirect to login screen
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

/**
 * Server action to inspect active session from client components
 */
export async function getActiveSessionUser(): Promise<AdminUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
