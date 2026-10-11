const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "code",
});

/** Formats an amount in cents (as stored in the DB) as MXN, e.g. "MXN 16,000.00". */
export function formatCents(cents: number) {
  return currency.format(cents / 100);
}
