
'use client';
import { useState } from 'react';

export default function PayDepositButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function createOrder() {
    setLoading(true); setInfo(null);
    try {
      const res = await fetch('/api/payments/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed creating order');
      setInfo(`Mock order created: ${data.orderId} (amount: ${data.amount} ${data.currency})`);
      // TODO: Initialize Razorpay Checkout using NEXT_PUBLIC_RAZORPAY_KEY_ID
    } catch (e: any) {
      setInfo(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={createOrder} disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6 py-3 w-fit">{loading ? 'Creating…' : 'Pay deposit'}</button>
      {info && <p className="text-sm text-slate-700">{info}</p>}
    </div>
  );
}
