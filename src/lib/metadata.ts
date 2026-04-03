import { Metadata } from "next";

export const siteConfig = {
  name: "Next.js Company",
  description: "A modern web application built with Next.js, TypeScript, and Tailwind CSS",
  url: "https://example.com",
  ogImage: "/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example",
  },
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
    keywords: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web Development",
      "Modern Web App",
    ],
    authors: [{ name: "Next.js Company" }],
    creator: "Next.js Company",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title,
      description,
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
      creator: "@example",
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

