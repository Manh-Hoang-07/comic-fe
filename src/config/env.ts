export const env = {
  apiUrl: process.env.API_URL || "http://127.0.0.1:8000",
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  siteName: process.env.SITE_NAME || "Shop Online",
  siteDescription: process.env.SITE_DESCRIPTION || "",
  ogImage: process.env.OG_IMAGE || "/default.svg",
  appSecret: process.env.APP_SECRET || "",
  revalidateSecret: process.env.REVALIDATE_SECRET || "",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  redisEnabled: process.env.REDIS_ENABLED === "true",
} as const;
