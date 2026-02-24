'use client';

import { useMemo, useState } from 'react';

const baseChecklist: Record<string, string[]> = {
  generic: [
    'Passport (6+ months validity)',
    'Recent photographs',
    'Hospital invitation/LOI',
    'Proof of funds',
    'Travel itinerary',
    'Medical records',
  ],
  india: ['Online visa form', 'Biometric appointment', 'Visa fee receipt'],
  uae: ['Sponsor details or hospital letter', 'Return/onward tickets'],
  russia: ['Visa support letter', 'Insurance policy (as required)'],
  nepal: ['Visa-on-arrival eligibility check'],
};

export default function VisaPage() {
  const [country, setCountry] = useState('India');
  const [nationality, setNationality] = useState('');
  const [procedure, setProcedure] = useState('');

  const checklist = useMemo(() => {
    const list = [...baseChecklist.generic];
    const key = country.toLowerCase() as keyof typeof baseChecklist;

    if (key in baseChecklist) {
      list.push(...baseChecklist[key]);
    }

    if (procedure.toLowerCase().includes('oncology')) list.push('Oncologist report & staging summary');
    if (procedure.toLowerCase().includes('card')) list.push('Cardiologist notes & latest ECHO');
    if (nationality.toLowerCase().includes('nigeria')) list.push('Yellow fever vaccination card');

    return list;
  }, [country, nationality, procedure]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Medical Visa Checklist</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border px-4 py-3"
          placeholder="Destination country (India, Nepal, UAE, Russia)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          className="rounded-xl border px-4 py-3"
          placeholder="Your nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
        <input
          className="rounded-xl border px-4 py-3"
          placeholder="Procedure (e.g., Cardiac surgery)"
          value={procedure}
          onChange={(e) => setProcedure(e.target.value)}
        />
      </div>
      <ul className="ml-5 list-disc">
        {checklist.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-slate-600">
        Need help? Our visa concierge can assist with forms, appointments, and translations.
      </p>
    </div>
  );
}
