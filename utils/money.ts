/**
 * Converts a validated decimal string (up to 2 decimals) to integer cents.
 * Splits on the dot instead of multiplying by 100 to avoid float rounding.
 */
export function toCents(amount: string) {
  const [units, cents = ""] = amount.split(".");
  return Number(units) * 100 + Number(cents.padEnd(2, "0"));
}

/**
 * Inverse of `toCents`: integer cents to the form's decimal string, without trailing `.00`.
 * Integer math, so no float rounding.
 * @example fromCents(15_050) → "150.50"
 */
export function fromCents(cents: number) {
  const units = Math.trunc(cents / 100);
  const rest = cents % 100;
  return rest ? `${units}.${String(rest).padStart(2, "0")}` : String(units);
}
