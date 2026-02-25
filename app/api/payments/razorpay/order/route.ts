import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '../../../../../lib/integrations';
import { sanitizeCurrencyCode, sanitizePositiveAmount } from '../../../../../lib/utils';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const amount = sanitizePositiveAmount(payload?.amount);
    const currency = sanitizeCurrencyCode(payload?.currency, 'INR');

    if (!amount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const receipt = `deposit_${Date.now()}`;
    const order = await createRazorpayOrder({
      amountInMajorUnits: amount,
      currency,
      receipt,
      notes: {
        product: 'medical-travel-deposit',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount / 100,
      amountInMinorUnits: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation failed', error);
    return NextResponse.json(
      { error: 'Unable to create payment order right now.' },
      { status: 500 }
    );
  }
}
