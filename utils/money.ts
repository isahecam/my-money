/**
 * Converts a validated decimal string (up to 2 decimals) to integer cents.
 * Splits on the dot instead of multiplying by 100 to avoid float rounding.
 */
export function toCents(amount: string) {
  const [units, cents = ""] = amount.split(".");
  return Number(units) * 100 + Number(cents.padEnd(2, "0"));
}
