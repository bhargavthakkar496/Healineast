
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

export function sanitizePositiveAmount(input: unknown, max = 1000000) {
  const amount = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.min(Math.round(amount * 100) / 100, max);
}
