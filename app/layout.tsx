import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
const lato = Lato({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Notevo",
    default: "Notevo : Simple, Structured Note-Taking. Supercharged by AI.",
  },
  description:
    "Interact with Your Notes Like Never Before. Organize, Discuss, and Enhance Your Ideas Seamlessly, Notevo helps you capture your thoughts, organize them effortlessly, and interact with your notes using powerful AI all in one clean, modern interface.",

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-brand_primary text-brand_tertiary flex flex-col min-h-screen",
            lato.className,
          )}
        >
          <Toaster />
          <ConvexClientProvider>
            <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
