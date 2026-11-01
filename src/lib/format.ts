/** 3900 -> "Rs 3,900". Strings (from db.json, already formatted) are only prefixed. */
export function formatPrice(amount: number | string): string {
  return `Rs ${typeof amount === 'number' ? amount.toLocaleString('en-US') : amount}`;
}
