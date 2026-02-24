import { NextRequest, NextResponse } from 'next/server';
import { sanitizePositiveAmount } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const amount = sanitizePositiveAmount(payload?.amount);

  if (!amount) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Normally: create order via Razorpay REST using RAZORPAY_KEY_ID/SECRET
  const orderId = 'order_' + Math.random().toString(36).slice(2);
  return NextResponse.json({ orderId, amount, currency: 'USD' });
}
