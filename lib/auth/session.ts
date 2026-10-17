/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER-SIDE AUTH & SESSION MANAGEMENT
 * Edge-compatible Web Crypto hashing and secure cookie sessions
 * ==============================================================================
 */

import { cookies } from 'next/headers';
import type { AdminUser, AdminSession, UserRole } from '@/types/admin';

const SESSION_COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME || 'varah_admin_session';
const SESSION_MAX_AGE = Number(process.env.AUTH_SESSION_MAX_AGE) || 60 * 60 * 24 * 7; // 7 days

// Default Seed User Profile for Initial Deployment
export const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: 'usr_owner_001',
  email: process.env.INITIAL_ADMIN_EMAIL || 'admin@varah.ai',
  name: process.env.INITIAL_ADMIN_NAME || 'Dhruv & Bhavya (Founders)',
  avatarUrl: null,
  role: 'OWNER',
  isActive: true,
  twoFactorEnabled: false,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Hash a plain password using Web Crypto PBKDF2 (SHA-256)
 * Generates a salt:hash string suitable for constant-time comparison
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const rawKey = await crypto.subtle.exportKey('raw', key);
  const hashHex = Array.from(new Uint8Array(rawKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const saltHex = Array.from(salt)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a plain password against a stored salt:hash string
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, expectedHash] = storedHash.split(':');
  if (!saltHex || !expectedHash) return false;

  const enc = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const rawKey = await crypto.subtle.exportKey('raw', key);
  const actualHash = Array.from(new Uint8Array(rawKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return actualHash === expectedHash;
}

/**
 * Sign an auth payload using HMAC-SHA256
 */
async function signSessionToken(payload: string): Promise<string> {
  const secret = process.env.AUTH_SECRET || 'fallback-dev-secret-replace-in-production-minimum-32-chars';
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${btoa(payload)}.${sigHex}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed session token
 */
async function verifySessionToken(token: string): Promise<AdminUser | null> {
  try {
    const [b64Payload, sigHex] = token.split('.');
    if (!b64Payload || !sigHex) return null;

    const payload = atob(b64Payload);
    const secret = process.env.AUTH_SECRET || 'fallback-dev-secret-replace-in-production-minimum-32-chars';
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload));
    if (!isValid) return null;

    const parsed = JSON.parse(payload) as { user: AdminUser; exp: number };
    if (Date.now() > parsed.exp) return null;

    return parsed.user;
  } catch {
    return null;
  }
}

/**
 * Write signed session cookie
 */
export async function createSession(user: AdminUser): Promise<void> {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = JSON.stringify({ user, exp });
  const signedToken = await signSessionToken(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_APP_URL?.startsWith('https')),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Retrieve verified session user on server components and actions
 */
export async function getSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const user = await verifySessionToken(token);
      if (user && user.isActive) {
        return {
          user,
          token,
          expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
        };
      }
    }
  } catch {
    // Non-cookie environment fallback
  }

  // Graceful fallback to default Super Admin in local development
  if (process.env.NODE_ENV !== 'production') {
    return {
      user: DEFAULT_SUPER_ADMIN,
      token: 'dev_mock_session_token',
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
    };
  }

  return null;
}

/**
 * Terminate current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
