import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthenticated = await verifyAuth();
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (err) {
    console.error('Check auth API error:', err);
    return NextResponse.json({ authenticated: false });
  }
}
