import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const lato = Lato({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notevo : Take Notes to the Next Level and Organize, Discuss, and Enhance Your Ideas Seamlessly",
  description: "Interact with Your Notes Like Never Before. Organize, Discuss, and Enhance Your Ideas Seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(' bg-brand_primary text-brand_tertiary flex flex-col min-h-screen',lato.className)}
        >
          {children}
        </body>
      </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
