import PayDepositButton from '@/components/PayDepositButton';

export const metadata = { title: 'Dashboard' };

const itinerary = [
  { date: '2026-03-01', item: 'Tele-consult (oncology)' },
  { date: '2026-03-05', item: 'Visa biometrics appointment' },
  { date: '2026-03-20', item: 'Arrival · Airport pickup' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Itinerary</h2>
        <ul className="space-y-2">
          {itinerary.map((stop) => (
            <li
              key={`${stop.date}-${stop.item}`}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <span>{stop.date}</span>
              <span>{stop.item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Next steps</h2>
        <ul className="ml-5 list-disc text-sm">
          <li>Upload medical records</li>
          <li>Download hospital LOI</li>
          <li>Complete visa checklist</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Secure payment</h2>
        <PayDepositButton amount={200} />
        <p className="mt-2 text-xs text-slate-500">
          Razorpay checkout is live here. If payment does not open, verify `RAZORPAY_KEY_ID`,
          `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` in deployment envs.
        </p>
      </section>
    </div>
  );
}
