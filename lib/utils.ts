
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function currency(amount: number, code = 'USD') {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount); }
  catch { return `${code} ${amount.toFixed(2)}`; }
}
