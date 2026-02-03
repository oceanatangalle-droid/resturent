/**
 * Strip leading currency symbol(s) from a price string and prepend the site's currency symbol.
 * Handles prices like "$14", "$12-16", "€9", "£42", etc.
 */
export function formatPrice(price: string, currencySymbol: string): string {
  if (!price || typeof price !== 'string') return (currencySymbol || '$') + '0'
  const sym = currencySymbol ?? '$'
  const trimmed = price.trim()
  // Remove common currency prefixes (R$, A$, C$, Fr, Rs, or single symbols $ € £ ¥ ₹ ₩)
  const withoutSymbol = trimmed
    .replace(/^(R\$|A\$|C\$|Fr|Rs)\s*/i, '')
    .replace(/^[\s$€£¥₹₩]+/, '')
    .trim()
  return sym + (withoutSymbol || trimmed)
}
