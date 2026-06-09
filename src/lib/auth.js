import { cookies } from 'next/headers';
import crypto from 'crypto';

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  return { username, password };
}

export function getSessionToken(username, password) {
  return crypto
    .createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex');
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    if (!sessionToken) return false;

    const { username, password } = getAdminCredentials();
    const expectedToken = getSessionToken(username, password);

    return sessionToken === expectedToken;
  } catch (err) {
    console.error('Auth verification error:', err);
    return false;
  }
}
