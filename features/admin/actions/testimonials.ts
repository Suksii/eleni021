"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { bool, invalid, num, str, type ActionState } from "@/features/admin/lib/form";

const schema = z.object({
  author: z.string().min(2, "Ime je obavezno."),
  occasion: z.string(),
  text: z.string().min(5, "Tekst je obavezan."),
  rating: z.number().int().min(1).max(5),
  sortOrder: z.number().int(),
  active: z.boolean(),
});

export async function saveTestimonial(id: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = schema.safeParse({
    author: str(fd, "author"),
    occasion: str(fd, "occasion"),
    text: str(fd, "text"),
    rating: num(fd, "rating") ?? 5,
    sortOrder: num(fd, "sortOrder") ?? 0,
    active: bool(fd, "active"),
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  let newId: number | null = null;
  if (id) {
    await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  } else {
    const [row] = await db.insert(testimonials).values(parsed.data).returning({ id: testimonials.id });
    newId = row.id;
  }
  updateTag(TAGS.testimonials);
  if (newId) redirect(`/admin/utisci/${newId}`);
  return { ok: true };
}

export async function deleteTestimonial(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  updateTag(TAGS.testimonials);
  return {};
}
