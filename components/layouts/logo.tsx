import { WalletIcon } from "lucide-react";

export function Logo() {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
        <WalletIcon size={16} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">My Money</span>
        <span className="truncate text-xs">Finanzas personales</span>
      </div>
    </>
  );
}
