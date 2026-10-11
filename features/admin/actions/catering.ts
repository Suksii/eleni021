"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { cateringPackages } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { slugify } from "@/lib/utils/slugify";
import { bool, invalid, jsonArray, lines, num, str, type ActionState } from "@/features/admin/lib/form";

const schema = z.object({
  name: z.string().min(2, "Naziv je obavezan."),
  slug: z.string().min(2),
  description: z.string(),
  pricePerPerson: z.number({ error: "Unesite cenu po osobi." }).min(0),
  minPersons: z.number().int().min(1),
  items: z.array(z.string()),
  image: z.string(),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int(),
});

export async function savePackage(id: number | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const name = str(fd, "name");
  const parsed = schema.safeParse({
    name,
    slug: slugify(str(fd, "slug") || name),
    description: str(fd, "description"),
    pricePerPerson: num(fd, "pricePerPerson"),
    minPersons: num(fd, "minPersons") ?? 10,
    items: lines(fd, "items"),
    image: jsonArray(fd, "image")[0] ?? "",
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    sortOrder: num(fd, "sortOrder") ?? 0,
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  let newId: number | null = null;
  try {
    if (id) {
      await db.update(cateringPackages).set(parsed.data).where(eq(cateringPackages.id, id));
    } else {
      const [row] = await db.insert(cateringPackages).values(parsed.data).returning({ id: cateringPackages.id });
      newId = row.id;
    }
  } catch {
    return { error: "Čuvanje nije uspelo. Slug verovatno već postoji." };
  }
  updateTag(TAGS.catering);
  if (newId) redirect(`/admin/ketering/${newId}`);
  return { ok: true };
}

export async function deletePackage(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(cateringPackages).where(eq(cateringPackages.id, id));
  updateTag(TAGS.catering);
  return {};
}
