import { useState } from 'react';
import PayDepositButton from '@/components/PayDepositButton';

export const metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  const [itinerary] = useState([
    { date: '2026-03-01', item: 'Tele-consult (oncology)' },
    { date: '2026-03-05', item: 'Visa biometrics appointment' },
    { date: '2026-03-20', item: 'Arrival · Airport pickup' },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <section>
        <h2 className="text-lg font-semibold mb-2">Itinerary</h2>
        <ul className="space-y-2">
          {itinerary.map((t, idx) => (
            <li key={idx} className="border rounded-xl px-4 py-3 flex items-center justify-between">
              <span>{t.date}</span>
              <span>{t.item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Next steps</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>Upload medical records</li>
          <li>Download hospital LOI</li>
          <li>Complete visa checklist</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Secure payment</h2>
        <PayDepositButton amount={200} />
        <p className="text-xs text-slate-500 mt-2">Demo only: creates a mock Razorpay order server-side. Replace with real API calls and Checkout.js initialization.</p>
      </section>
    </div>
  );
}
