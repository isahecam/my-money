import type { Metadata, Viewport } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finances.isahecam.com"),
  title: {
    default: "My Money",
    template: "%s | My Money",
  },
  description: "Mi aplicación de finanzas personales.",
  openGraph: {
    title: "My Money",
    description: "Mi aplicación de finanzas personales.",
    url: "/",
    siteName: "My Money",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Money",
    description: "Mi aplicación de finanzas personales.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ede9de" },
    { media: "(prefers-color-scheme: dark)", color: "#3d3929" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", outfit.variable, geistMono.variable, "font-sans")}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
