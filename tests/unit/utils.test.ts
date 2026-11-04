import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats positive numbers in Indian Rupee format', () => {
    const formatted = formatCurrency(123456.78);
    expect(formatted).toContain('1,23,456.78');
    expect(formatted).toContain('₹');
  });

  it('handles zero cleanly', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
  });

  it('handles null, undefined, or NaN safely', () => {
    expect(formatCurrency(null)).toBe('₹0.00');
    expect(formatCurrency(undefined)).toBe('₹0.00');
    expect(formatCurrency(NaN)).toBe('₹0.00');
  });
});

describe('formatDate', () => {
  it('formats valid ISO date strings to Indian standard date', () => {
    const formatted = formatDate('2026-11-04T00:00:00Z');
    expect(formatted).toBe('04 Nov 2026');
  });

  it('returns dash on invalid or empty date', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
    expect(formatDate('invalid-date')).toBe('-');
  });
});

describe('cn', () => {
  it('combines truthy class names and filters falsy ones', () => {
    expect(cn('btn', false && 'hidden', 'btn-primary', null, undefined, 'active')).toBe(
      'btn btn-primary active'
    );
  });
});
