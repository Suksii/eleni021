"use server";

import { sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { TAGS } from "@/lib/cacheTags";
import { SETTING_GROUPS } from "@/features/site/settingsFields";
import { jsonArray, str, type ActionState } from "@/features/admin/lib/form";

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const rows = SETTING_GROUPS.flatMap((g) => g.fields).map((f) => ({
    key: f.key,
    value: f.type === "image" ? (jsonArray(fd, f.key)[0] ?? "") : str(fd, f.key),
  }));

  await db
    .insert(settings)
    .values(rows)
    .onConflictDoUpdate({ target: settings.key, set: { value: sql`excluded.value` } });

  updateTag(TAGS.settings);
  return { ok: true };
}
