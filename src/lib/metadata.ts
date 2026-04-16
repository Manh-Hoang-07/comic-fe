import { Metadata } from "next";
import { env } from "@/config/env";

export const siteConfig = {
  name: env.siteName,
  description: env.siteDescription,
  url: env.siteUrl,
  ogImage: env.ogImage,
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function constructPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return constructMetadata({
    title: `${title} | ${siteConfig.name}`,
    description,
    image: siteConfig.ogImage,
  });
}
