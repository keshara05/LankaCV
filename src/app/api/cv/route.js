import { NextResponse } from 'next/server';
import { saveCV, getCV } from '@/lib/db';

export async function POST(request) {
  try {
    const { id, cvData } = await request.json();
    if (!id || !cvData) {
      return NextResponse.json({ error: 'Missing CV id or data' }, { status: 400 });
    }
    
    await saveCV(id, cvData);
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing CV id parameter' }, { status: 400 });
    }

    const cv = await getCV(id);
    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    return NextResponse.json(cv);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
