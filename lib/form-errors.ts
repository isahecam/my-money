import { setErrors } from "@formisch/react";
import type { FormStore } from "@formisch/react";

/**
 * Sets next-safe-action flattened `fieldErrors` on their Formisch fields.
 * Formisch counterpart of `mapToHookFormErrors` from the react-hook-form adapter.
 */
export function mapToFormischErrors(
  form: FormStore,
  fieldErrors: Partial<Record<string, string[]>>,
) {
  Object.entries(fieldErrors)
    .filter((entry): entry is [string, [string, ...string[]]] => Boolean(entry[1]?.length))
    .forEach(([field, errors]) => setErrors(form, { path: [field], errors }));
}
