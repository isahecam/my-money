import { Logo } from "@/components/layouts/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <header className="flex h-14 items-center gap-2 px-3 py-2">
        <Logo />
      </header>
      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
