/** Format a PostgreSQL date (string or Date) → "YYYY-MM-DD" */
export const formatDate = (d: string | Date | undefined | null): string => {
  if (!d) return '—';
  return String(d).split('T')[0];
};

/** Safely parse price (PostgreSQL returns decimals as strings) */
export const formatPrice = (p: number | string | undefined | null): string => {
  if (p === null || p === undefined) return '0.00';
  return parseFloat(String(p)).toFixed(2);
};

/** Number as currency string */
export const toCurrency = (p: number | string): string =>
  `$${formatPrice(p)}`;

/** Vehicle type → emoji */
export const vehicleEmoji = (type: string): string => ({
  car: '🚗', bike: '🏍️', van: '🚐', SUV: '🚙',
}[type] ?? '🚗');

/** Vehicle type → gradient CSS classes */
export const vehicleGradient = (type: string): string => ({
  car:  'from-blue-500 to-blue-600',
  bike: 'from-green-500 to-emerald-600',
  van:  'from-orange-500 to-amber-600',
  SUV:  'from-purple-500 to-violet-600',
}[type] ?? 'from-gray-500 to-gray-600');

/** Capitalize first letter */
export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);