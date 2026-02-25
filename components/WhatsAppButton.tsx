'use client';

import { sanitizePhoneNumber } from '@/lib/utils';

const DEFAULT_WHATSAPP_NUMBER = '919016307635';
const DEFAULT_MESSAGE = 'Hi HealinginEast, I need assistance with medical travel.';

export default function WhatsAppButton() {
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const sanitizedNumber = sanitizePhoneNumber(configuredNumber || DEFAULT_WHATSAPP_NUMBER);

  if (!sanitizedNumber) {
    return (
      <div className="fixed bottom-6 right-6 rounded-full border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-lg">
        WhatsApp not configured
      </div>
    );
  }

  const href = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:bg-green-600"
      aria-label="Contact HealinginEast on WhatsApp"
    >
      WhatsApp Us
    </a>
  );
}
