"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSystemConfig } from "./useSystemConfig";

export interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

export interface SeoResult {
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  seoUrl: string;
  canonicalUrl: string;
  metaTags: {
    title: string;
    description: string;
    robots: string;
    keywords?: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    twitterSite?: string;
    articlePublishedTime?: string;
    articleModifiedTime?: string;
    articleAuthor?: string;
    articleTag?: string | string[];
  };
  linkTags: Array<{ rel: string; href: string }>;
  structuredData: any;
}

/**
 * Hook để quản lý SEO meta tags
 * Ưu tiên lấy từ system config, fallback về runtime config
 */
export function useSeo(options: SeoOptions = {}): SeoResult {
  const pathname = usePathname();
  const { getConfigValue } = useSystemConfig("general", { enableCache: true });

  // Helper để kiểm tra giá trị có thực sự tồn tại không (không phải null/undefined/empty)
  const hasValue = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string") return val.trim() !== "";
    return true;
  };

  // Helper để lấy site URL
  const siteUrl = useMemo(() => {
    const canonical = getConfigValue("canonical_url");
    if (hasValue(canonical)) return canonical as string;
    return process.env.NEXT_PUBLIC_SITE_URL || "";
  }, [getConfigValue]);

  // Tính toán các giá trị SEO từ options
  const seoTitle = useMemo(() => {
    if (options.title) {
      const siteName =
        (getConfigValue("og_title") as string) ||
        (getConfigValue("site_name") as string) ||
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "";
      return options.title.includes(siteName)
        ? options.title
        : `${options.title} | ${siteName}`;
    }
    return (
      (getConfigValue("og_title") as string) ||
      (getConfigValue("meta_title") as string) ||
      (getConfigValue("site_name") as string) ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      ""
    );
  }, [options.title, getConfigValue]);

  const seoDescription = useMemo(() => {
    if (options.description) return options.description;
    const seoDesc =
      (getConfigValue("meta_description") as string) ||
      (getConfigValue("og_description") as string);
    if (hasValue(seoDesc)) return seoDesc;
    return process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "";
  }, [options.description, getConfigValue]);

  const seoImage = useMemo(() => {
    if (options.image) {
      return options.image.startsWith("http")
        ? options.image
        : `${siteUrl}${options.image}`;
    }
    const ogImg = getConfigValue("og_image") as string;
    const image = hasValue(ogImg)
      ? ogImg
      : process.env.NEXT_PUBLIC_OG_IMAGE || "/default.svg";
    return image.startsWith("http") ? image : `${siteUrl}${image}`;
  }, [options.image, siteUrl, getConfigValue]);

  const seoUrl = useMemo(() => {
    if (options.url) {
      return options.url.startsWith("http")
        ? options.url
        : `${siteUrl}${options.url}`;
    }
    return `${siteUrl}${pathname}`;
  }, [options.url, siteUrl, pathname]);

  const canonicalUrl = useMemo(() => {
    // Nếu có canonical từ options, dùng nó
    if (options.canonical) {
      return options.canonical.startsWith("http")
        ? options.canonical
        : `${siteUrl}${options.canonical}`;
    }

    // Mỗi page có canonical riêng dựa trên route
    return `${siteUrl}${pathname}`;
  }, [options.canonical, siteUrl, pathname]);

  const seoType = useMemo(() => options.type || "website", [options.type]);

  // Tạo meta tags - lấy trực tiếp từ config theo yêu cầu
  const metaTags = useMemo(() => {
    // Lấy giá trị trực tiếp từ config
    const siteDescription = (getConfigValue("site_description") as string) || "";
    const ogTitle = (getConfigValue("og_title") as string) || "";
    const ogDescription = (getConfigValue("og_description") as string) || "";
    const ogImage = (getConfigValue("og_image") as string) || "";
    const canonicalUrlValue =
      (getConfigValue("canonical_url") as string) || siteUrl || "";
    const ogSiteName =
      canonicalUrlValue ||
      (getConfigValue("site_name") as string) ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "";

    // Twitter site
    const twitter = getConfigValue("twitter_site") as string;
    const twitterSite = twitter ? `@${twitter}` : undefined;

    const meta: SeoResult["metaTags"] = {
      title: seoTitle,
      description: siteDescription, // Lấy từ site_description
      robots: options.noindex ? "noindex,nofollow" : "index,follow",
      ogTitle: ogTitle, // Lấy từ og_title
      ogDescription: ogDescription, // Lấy từ og_description
      ogImage: ogImage, // Lấy từ og_image
      ogUrl: canonicalUrlValue, // Lấy từ canonical_url
      ogType: seoType,
      ogSiteName: ogSiteName, // Lấy từ canonical_url (hoặc site_name nếu không có)
      twitterCard: "summary_large_image",
      twitterTitle: ogTitle,
      twitterDescription: ogDescription,
      twitterImage: ogImage,
      ...(twitterSite ? { twitterSite } : {}),
    };

    // Meta keywords từ config nếu có
    const metaKeywords = getConfigValue("meta_keywords") as string;
    if (metaKeywords) {
      meta.keywords = metaKeywords;
    }

    // Article specific meta
    if (seoType === "article") {
      if (options.publishedTime) {
        meta.articlePublishedTime = options.publishedTime;
      }
      if (options.modifiedTime) {
        meta.articleModifiedTime = options.modifiedTime;
      }
      if (options.author) {
        meta.articleAuthor = options.author;
      }
      if (options.tags && options.tags.length > 0) {
        meta.articleTag = options.tags;
      }
    }

    return meta;
  }, [
    getConfigValue,
    siteUrl,
    seoTitle,
    seoType,
    options.noindex,
    options.publishedTime,
    options.modifiedTime,
    options.author,
    options.tags,
  ]);

  // Link tags
  const linkTags = useMemo(() => {
    const links: Array<{ rel: string; href: string }> = [];

    if (canonicalUrl) {
      links.push({
        rel: "canonical",
        href: canonicalUrl,
      });
    }

    return links;
  }, [canonicalUrl]);

  // Structured Data (JSON-LD)
  const structuredData = useMemo(() => {
    const siteName =
      (getConfigValue("site_name") as string) ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Cửa hàng";

    const baseData: any = {
      "@context": "https://schema.org",
      "@type":
        seoType === "product"
          ? "Product"
          : seoType === "article"
          ? "Article"
          : "WebSite",
      name: seoTitle,
      description: seoDescription,
      url: seoUrl,
      image: seoImage,
    };

    if (seoType === "website") {
      baseData.potentialAction = {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      };
    }

    if (seoType === "article") {
      baseData.headline = seoTitle;
      baseData.datePublished = options.publishedTime;
      baseData.dateModified = options.modifiedTime || options.publishedTime;
      if (options.author) {
        baseData.author = {
          "@type": "Person",
          name: options.author,
        };
      }
      baseData.publisher = {
        "@type": "Organization",
        name: siteName,
        logo: {
          "@type": "ImageObject",
          url: seoImage,
        },
      };
    }

    if (seoType === "product") {
      // Có thể mở rộng thêm với product-specific data
      baseData.brand = {
        "@type": "Brand",
        name: siteName,
      };
    }

    return baseData;
  }, [
    getConfigValue,
    seoType,
    seoTitle,
    seoDescription,
    seoUrl,
    seoImage,
    siteUrl,
    options.publishedTime,
    options.modifiedTime,
    options.author,
  ]);

  return {
    seoTitle,
    seoDescription,
    seoImage,
    seoUrl,
    canonicalUrl,
    metaTags,
    linkTags,
    structuredData,
  };
}



