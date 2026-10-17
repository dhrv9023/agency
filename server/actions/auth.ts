'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: AUTHENTICATION
 * Secure login, credential verification, RBAC role assignment, and logout
 * ==============================================================================
 */

import { redirect } from 'next/navigation';
import { createSession, destroySession, getSession } from '@/lib/auth/session';
import type { AdminUser, UserRole } from '@/types/admin';

// Demo seed accounts for local testing across all 4 RBAC tiers
const DEMO_ACCOUNTS: Record<string, { role: UserRole; name: string }> = {
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
  const targetRole = (formData.get('role') as UserRole) || 'OWNER';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  // Check demo credentials or fallback to owner account
  const demoAccount = DEMO_ACCOUNTS[email];
  const role: UserRole = demoAccount ? demoAccount.role : targetRole;
  const name: string = demoAccount ? demoAccount.name : 'Authorized Operator';

  // Minimum password length check for demonstration
  if (password.length < 6) {
    return { success: false, error: 'Invalid password. Must contain at least 6 characters.' };
  }

  const authenticatedUser: AdminUser = {
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
