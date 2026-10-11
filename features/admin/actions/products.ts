"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { products, PRODUCT_UNITS } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { slugify } from "@/lib/utils/slugify";
import { bool, invalid, jsonArray, num, str, type ActionState } from "@/features/admin/lib/form";

const schema = z.object({
  name: z.string().min(2, "Naziv je obavezan."),
  slug: z.string().min(2, "Slug je obavezan."),
  categoryId: z.number().int().positive().nullable(),
  shortDescription: z.string().max(300, "Najviše 300 znakova."),
  description: z.string(),
  price: z.number({ error: "Unesite cenu." }).min(0, "Cena ne može biti negativna."),
  unit: z.enum(PRODUCT_UNITS),
  images: z.array(z.string()),
  servings: z.string(),
  allergens: z.string(),
  leadTimeDays: z.number().int().min(0),
  minQuantity: z.number().int().min(1),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int(),
});

export async function saveProduct(id: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const name = str(fd, "name");
  const parsed = schema.safeParse({
    name,
    slug: slugify(str(fd, "slug") || name),
    categoryId: num(fd, "categoryId") || null,
    shortDescription: str(fd, "shortDescription"),
    description: str(fd, "description"),
    price: num(fd, "price"),
    unit: str(fd, "unit"),
    images: jsonArray(fd, "images"),
    servings: str(fd, "servings"),
    allergens: str(fd, "allergens"),
    leadTimeDays: num(fd, "leadTimeDays") ?? 2,
    minQuantity: num(fd, "minQuantity") ?? 1,
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    sortOrder: num(fd, "sortOrder") ?? 0,
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  let newId: number | null = null;
  try {
    if (id) {
      await db.update(products).set(parsed.data).where(eq(products.id, id));
    } else {
      const [row] = await db.insert(products).values(parsed.data).returning({ id: products.id });
      newId = row.id;
    }
  } catch {
    return { error: "Čuvanje nije uspelo. Slug verovatno već postoji." };
  }
  updateTag(TAGS.products);
  if (newId) redirect(`/admin/proizvodi/${newId}`);
  return { ok: true };
}

export async function deleteProduct(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(products).where(eq(products.id, id));
  updateTag(TAGS.products);
  return {};
}

export async function toggleProduct(id: number, field: "active" | "featured", value: boolean) {
  await requireSession();
  await db.update(products).set({ [field]: value }).where(eq(products.id, id));
  updateTag(TAGS.products);
}
