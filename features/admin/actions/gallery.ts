"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { jsonArray, num, str, type ActionState } from "@/features/admin/lib/form";

export async function addGalleryImages(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const images = jsonArray(fd, "images");
  if (images.length === 0) return { error: "Dodajte bar jednu sliku." };
  const caption = str(fd, "caption");
  const start = num(fd, "sortOrder") ?? 0;
  await db.insert(galleryImages).values(images.map((image, i) => ({ image, caption, sortOrder: start + i })));
  updateTag(TAGS.gallery);
  return { ok: true };
}

export async function updateGalleryImage(id: number, data: { caption?: string; sortOrder?: number; active?: boolean }) {
  await requireSession();
  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
  updateTag(TAGS.gallery);
}

export async function deleteGalleryImage(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  updateTag(TAGS.gallery);
  return {};
}
