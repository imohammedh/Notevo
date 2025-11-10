import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { ConvexQueryCacheProvider } from "@/cache/provider";
const lato = Lato({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Notevo", 
    default: "Notevo - Simple, Structured Note-Taking. Supercharged by AI.",
  },
  description:
    "Interact with Your Notes Like Never Before. Organize, Discuss, and Enhance Your Ideas Seamlessly. Notevo helps you capture your thoughts, organize them effortlessly, and interact with your notes using powerful AI all in one clean, modern interface.",

  icons: {
    icon: "/favicon.png",
  },

  // Add these for better social sharing
  openGraph: {
    title: "Notevo -  Simple, Structured Note-Taking App.",
    description: "Interact with Your Notes Like Never Before. Organize, Discuss, and Enhance Your Ideas Seamlessly with powerful AI.",
    url: "https://notevo.vercel.app",
    siteName: "Notevo",
    images: [
      {
        url: "/og-image.png", // Create a 1200x630px image
        width: 1200,
        height: 630,
        alt: "Notevo - Simple, Structured Note-Taking App.",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Notevo - Simple, Structured Note-Taking App.",
    description: "Organize, Discuss, and Enhance Your Ideas Seamlessly with AI-powered note-taking.",
    images: ["/og-image.png"],
  },

  keywords: [
    "note-taking",
    "AI notes",
    "productivity",
    "organization",
    "smart notes",
    "note organizer",
  ],

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background text-foreground flex flex-col min-h-screen", lato.className)}>
        <Toaster />
        <Providers>
          <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>
              <ConvexQueryCacheProvider expiration={2 * 60 * 60 * 1000}>
                {children}
              </ConvexQueryCacheProvider>
            </ConvexClientProvider>
          </ConvexAuthNextjsServerProvider>
        </Providers>
      </body>
    </html>
  );
}

