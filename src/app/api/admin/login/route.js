import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminCredentials, getSessionToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const creds = getAdminCredentials();

    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = getSessionToken(creds.username, creds.password);
    const cookieStore = await cookies();

    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
