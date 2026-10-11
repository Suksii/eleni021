import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { TAGS } from "@/lib/cacheTags";

export type SiteSettings = Record<string, string>;

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.settings);

  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
