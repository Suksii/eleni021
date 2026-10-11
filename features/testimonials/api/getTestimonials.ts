import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { testimonials, type Testimonial } from "@/db/schema";
import { TAGS } from "@/lib/cacheTags";

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("content");
  cacheTag(TAGS.testimonials);

  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.active, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
}
