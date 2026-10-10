"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavGroup } from "@/types/shared-types";

export function NavMain({
  group,
  ...props
}: { group: NavGroup } & React.ComponentProps<typeof SidebarGroup>) {
  const segment = useSelectedLayoutSegment();
  const activeRoute = segment ? `/${segment}` : "/";

  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.route}>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={item.route === activeRoute}
                render={<Link href={item.route} />}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
