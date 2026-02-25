'use client';
import { useState } from 'react';

export default function QuoteForm({ procedureId }: { procedureId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.get('name'),
          email: formData.get('email'),
          whatsappNumber: formData.get('whatsappNumber'),
          nationality: formData.get('nationality'),
          procedureId,
          preferredDate: formData.get('preferredDate'),
          notes: formData.get('notes'),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          'Request submitted! Our care team will contact you within 24 hours on email/WhatsApp.'
        );
      } else setMessage(data.error || 'Something went wrong');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Network error';
      setMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="grid gap-3 mt-4">
      <input name="name" required placeholder="Full name" className="border rounded-xl px-4 py-3" />
      <input name="email" type="email" required placeholder="Email" className="border rounded-xl px-4 py-3" />
      <input
        name="whatsappNumber"
        required
        placeholder="WhatsApp number (e.g. 919999999999)"
        className="border rounded-xl px-4 py-3"
      />
      <input
        name="nationality"
        required
        placeholder="Nationality"
        className="border rounded-xl px-4 py-3"
      />
      <input name="preferredDate" type="date" className="border rounded-xl px-4 py-3" />
      <textarea
        name="notes"
        placeholder="Share medical history / questions"
        className="border rounded-xl px-4 py-3"
      />
      <button disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6 py-3">
        {loading ? 'Submitting…' : 'Request a quote'}
      </button>
      {message && <p className="text-sm text-green-700">{message}</p>}
    </form>
  );
}
