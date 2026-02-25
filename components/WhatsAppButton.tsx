'use client';

const DEFAULT_WHATSAPP_NUMBER = '919016307635';

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!number) {
    return (
      <div className="fixed bottom-6 right-6 rounded-full border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-lg">
        WhatsApp not configured
      </div>
    );
  }

  const href = `https://wa.me/${number}?text=Hi%20HealinginEast%2C%20I%20need%20assistance%20with%20medical%20travel.`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg"
    >
      WhatsApp Us
    </a>
  );
}
