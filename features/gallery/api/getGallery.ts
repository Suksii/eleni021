import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { galleryImages, type GalleryImage } from "@/db/schema";
import { TAGS } from "@/lib/cacheTags";

export async function getGallery(limit?: number): Promise<GalleryImage[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.gallery);

  const q = db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.active, true))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
  return limit ? q.limit(limit) : q;
}
