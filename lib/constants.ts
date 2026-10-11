import { ArrowLeftRightIcon, LayoutDashboardIcon } from "lucide-react";

import type { NavGroup } from "@/types/shared-types";

// `NEXT_PUBLIC_` so Client Components get it too; Next inlines it at build time.
if (!process.env.NEXT_PUBLIC_APP_TIMEZONE) {
  throw new Error("Missing NEXT_PUBLIC_APP_TIMEZONE (IANA time zone, e.g. America/Mexico_City).");
}

/** Time zone that resolves "today". Until it's stored per user, it's set per environment. */
export const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE;

/** Sidebar menus by placement: `main` fills the content */
export const SIDEBAR_NAV = {
  main: [
    {
      label: "Finanzas",
      items: [
        { label: "Resumen", route: "/", icon: LayoutDashboardIcon },
        { label: "Transacciones", route: "/transactions", icon: ArrowLeftRightIcon },
      ],
    },
  ],
} satisfies { main: NavGroup[] };
