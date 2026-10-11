"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { slugify } from "@/lib/utils/slugify";
import { bool, invalid, jsonArray, num, str, type ActionState } from "@/features/admin/lib/form";

const schema = z.object({
  name: z.string().min(2, "Naziv je obavezan."),
  slug: z.string().min(2, "Slug je obavezan."),
  description: z.string(),
  image: z.string(),
  sortOrder: z.number().int(),
  active: z.boolean(),
});

function revalidate() {
  updateTag(TAGS.categories);
  updateTag(TAGS.products);
}

export async function saveCategory(id: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const name = str(fd, "name");
  const parsed = schema.safeParse({
    name,
    slug: slugify(str(fd, "slug") || name),
    description: str(fd, "description"),
    image: jsonArray(fd, "image")[0] ?? "",
    sortOrder: num(fd, "sortOrder") ?? 0,
    active: bool(fd, "active"),
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  let newId: number | null = null;
  try {
    if (id) {
      await db.update(categories).set(parsed.data).where(eq(categories.id, id));
    } else {
      const [row] = await db.insert(categories).values(parsed.data).returning({ id: categories.id });
      newId = row.id;
    }
  } catch {
    return { error: "Čuvanje nije uspelo. Slug verovatno već postoji." };
  }
  revalidate();
  if (newId) redirect(`/admin/kategorije/${newId}`);
  return { ok: true };
}

export async function deleteCategory(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(categories).where(eq(categories.id, id));
  revalidate();
  return {};
}
