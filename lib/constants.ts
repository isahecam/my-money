import { LayoutDashboardIcon } from "lucide-react";

import type { NavGroup } from "@/types/shared-types";

/** Sidebar menus by placement: `main` fills the content */
export const SIDEBAR_NAV = {
  main: [
    {
      label: "Finanzas",
      items: [{ label: "Resumen", route: "/", icon: LayoutDashboardIcon }],
    },
  ],
} satisfies { main: NavGroup[] };
