import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

type NavItem = {
  label: string;
  route: Route;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
