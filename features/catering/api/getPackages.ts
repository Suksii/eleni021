import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { cateringPackages, type CateringPackage } from "@/db/schema";
import { TAGS } from "@/lib/cacheTags";

export async function getPackages(): Promise<CateringPackage[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.catering);

  return db
    .select()
    .from(cateringPackages)
    .where(eq(cateringPackages.active, true))
    .orderBy(asc(cateringPackages.sortOrder), asc(cateringPackages.name));
}

export async function getFeaturedPackages(limit = 2): Promise<CateringPackage[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.catering);

  return db
    .select()
    .from(cateringPackages)
    .where(and(eq(cateringPackages.active, true), eq(cateringPackages.featured, true)))
    .orderBy(asc(cateringPackages.sortOrder))
    .limit(limit);
}
