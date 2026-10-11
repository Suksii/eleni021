import type { NextConfig } from "next";

const IS_INDEXABLE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") === "https://eleni.me";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Roditeljski folder ima zalutali package-lock.json — bez ovoga Turbopack upozorava.
  turbopack: { root: __dirname },
  cacheHandlers: {
    default: require.resolve("./cache-handlers/disk.js"),
  },
  cacheLife: {
    // Katalog (proizvodi, kategorije, ketering) — CMS ga eksplicitno invalidira
    // preko `updateTag`, pa TTL služi samo kao sigurnosna mreža.
    catalog: { stale: 300, revalidate: 3600, expire: 86400 },
    content: { stale: 3600, revalidate: 3600, expire: 86400 },
    sitemap: { stale: 86400, revalidate: 86400, expire: 172800 },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    qualities: [70, 85],
    // CMS dozvoljava bilo koji https URL slike (Unsplash za početak, kasnije CDN).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    if (IS_INDEXABLE) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
