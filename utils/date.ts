import { dt } from "@/lib/date";

/** Formats a `YYYY-MM-DD` range in Spanish, e.g. "1 oct – 31 oct 2026". */
export function formatDateRange({ from, to }: { from: string; to: string }) {
  return `${dt.format(from, "d MMM")} – ${dt.format(to, "d MMM yyyy")}`;
}
