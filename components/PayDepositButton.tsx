'use client';
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PayDepositButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function createOrderAndPay() {
    setLoading(true);
    setInfo(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout script.');
      }

      const res = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed creating order');

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable right now.');
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amountInMinorUnits,
        currency: data.currency,
        name: 'HealinginEast',
        description: 'Medical travel deposit',
        order_id: data.orderId,
        handler: function handler(response: Record<string, string>) {
          setInfo(`Payment success! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'Medical Traveler',
        },
        notes: {
          source: 'healingineast-mvp',
        },
        theme: {
          color: '#0ea5e9',
        },
        modal: {
          ondismiss: () => setInfo('Payment cancelled.'),
        },
      });

      razorpay.open();
    } catch (e: any) {
      setInfo(e.message || 'Payment setup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={createOrderAndPay}
        disabled={loading}
        className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6 py-3 w-fit"
      >
        {loading ? 'Preparing payment…' : 'Pay deposit'}
      </button>
      {info && <p className="text-sm text-slate-700">{info}</p>}
    </div>
  );
}
