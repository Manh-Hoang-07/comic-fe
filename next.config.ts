/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  transpilePackages: ["ckeditor5", "@ckeditor/ckeditor5-react"],
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "lodash", "react-hook-form"],
  },
  images: {
    qualities: [10, 25, 50, 75, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [
          ...securityHeaders,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
  // Suppress deprecation warnings from dependencies
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      // Suppress Node.js deprecation warnings in server builds
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        return entries;
      };
    }
    return config;
  },
};

export default nextConfig;
