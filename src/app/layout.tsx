import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastContainer from "@/components/UI/Feedback/ToastContainer";
import { AuthInitializer } from "@/components/Providers/AuthInitializer";

import { NavigationProgress } from "@/components/UI/Navigation/NavigationProgress";
import { QueryProvider } from "@/components/Providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { env } from "@/config/env";

export const metadata: Metadata = {
  title: {
    default: env.siteName,
    template: `%s | ${env.siteName}`,
  },
  description: env.siteDescription,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <QueryProvider>
          <ToastProvider>
            <AuthInitializer />
            <ToastContainer />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}


