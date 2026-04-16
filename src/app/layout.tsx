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

import { getSystemConfig } from "@/lib/api/public/general";
import { env } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const systemConfig = await getSystemConfig("general");
  const siteName = systemConfig?.site_name || env.siteName;
  const siteDescription = systemConfig?.site_description || env.siteDescription;
  const favicon = systemConfig?.site_favicon;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: systemConfig?.meta_keywords || "",
    icons: {
      icon: favicon || "/favicon.ico",
      shortcut: favicon || "/favicon.ico",
      apple: favicon || "/favicon.ico",
    },
    openGraph: {
      title: systemConfig?.og_title || siteName,
      description: systemConfig?.og_description || siteDescription,
      images: systemConfig?.og_image ? [{ url: systemConfig.og_image }] : [],
    },
    metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
  };
}

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


