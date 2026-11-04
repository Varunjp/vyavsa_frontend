/**
 * Formats a numeric value into standard Indian Rupee (INR) currency representation.
 * Example: 123456.78 -> "₹ 1,23,456.78"
 */
export function formatCurrency(amount: number | null | undefined): string {
  const num = amount === null || amount === undefined || isNaN(Number(amount)) ? 0 : Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(num)
    .replace('INR', '₹')
    .trim();
}

/**
 * Formats an ISO date string or Date object into human-readable Indian standard format.
 * Example: "2026-11-04T12:00:00Z" -> "04 Nov 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';

  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Formats an ISO date string or Date object including time.
 * Example: "2026-11-04T12:00:00Z" -> "04 Nov 2026, 05:30 PM"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-';

  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Utility to conditionally combine class names cleanly.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
