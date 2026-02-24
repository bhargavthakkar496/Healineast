
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  // Normally: create order via Razorpay REST using RAZORPAY_KEY_ID/SECRET
  const orderId = 'order_' + Math.random().toString(36).slice(2);
  return NextResponse.json({ orderId, amount, currency: 'USD' });
}
