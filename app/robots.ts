import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Probni domen (vercel.app): botovi ne smeju ništa, bez sitemape.
  if (!env.isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/narudzba", "/api"] },
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
