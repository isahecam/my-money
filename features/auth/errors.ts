/**
 * Returns the message to show for a failed auth request.
 *
 * Uses `error.message`, already translated by the i18n plugin, except for 429:
 * the rate limiter responds before plugin hooks, with no error code.
 * Falls back to `fallback` when the error has no message.
 */
export function getErrorMessage(
  error: { status: number; message?: string },
  response: Response,
  fallback: string,
) {
  if (error.status === 429) {
    const retryAfter = response.headers.get("X-Retry-After");
    return retryAfter
      ? `Demasiados intentos. Vuelve a intentarlo en ${retryAfter} segundos.`
      : "Demasiados intentos. Vuelve a intentarlo más tarde.";
  }
  return error.message || fallback;
}
