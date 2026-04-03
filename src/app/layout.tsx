import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastContainer from "@/components/UI/Feedback/ToastContainer";
import { AuthInitializer } from "@/components/Providers/AuthInitializer";
import { GlobalLoadingOverlay } from "@/components/UI/Loading/GlobalLoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSystemConfig } from "@/lib/api/public/general";

export async function generateMetadata(): Promise<Metadata> {
  const systemConfig = await getSystemConfig("general");
  const siteName = systemConfig?.site_name || process.env.NEXT_PUBLIC_SITE_NAME || "Shop Online";
  const siteDescription = systemConfig?.site_description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "";
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
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <GlobalLoadingOverlay />
        </Suspense>
        <ToastProvider>
          <AuthInitializer />
          <ToastContainer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


