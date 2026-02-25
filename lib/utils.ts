
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function currency(amount: number, code = 'USD') {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount); }
  catch { return `${code} ${amount.toFixed(2)}`; }
}

export function sanitizeText(input: unknown, maxLength = 120) {
  if (typeof input !== 'string') return '';
  return input.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

export function sanitizeEmail(input: unknown) {
  const email = sanitizeText(input, 254).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email) ? email : '';
}

export function sanitizePhoneNumber(input: unknown, minLength = 8, maxLength = 15) {
  const digits = sanitizeText(input, 20).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length < minLength || digits.length > maxLength) return '';
  return digits;
}

export function sanitizeCurrencyCode(input: unknown, fallback = 'INR') {
  const code = sanitizeText(input, 3).toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : fallback;
}

export function safeSerializeJsonLd(input: unknown) {
  return JSON.stringify(input)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function sanitizePositiveAmount(input: unknown, max = 1000000) {
  const amount = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.min(Math.round(amount * 100) / 100, max);
}
