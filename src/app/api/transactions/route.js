import { NextResponse } from 'next/server';
import { createTransaction, getTransactions, updateTransactionStatus } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { cvId, bankName, paymentSlip, whatsappNumber } = await request.json();
    
    if (!cvId || !bankName || !paymentSlip) {
      return NextResponse.json({ error: 'Missing required checkout information' }, { status: 400 });
    }

    const txId = 'tx-' + Math.random().toString(36).substring(2, 9);
    await createTransaction(txId, cvId, bankName, paymentSlip, whatsappNumber || '');
    
    return NextResponse.json({ success: true, txId });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const list = await getTransactions();
    return NextResponse.json(list);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await verifyAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { txId, status } = await request.json();
    if (!txId || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    await updateTransactionStatus(txId, status);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
