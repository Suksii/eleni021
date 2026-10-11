"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { inquiries, INQUIRY_STATUSES, orders, ORDER_STATUSES } from "@/db/schema";
import { requireSession } from "@/lib/auth/session";
import { str, type ActionState } from "@/features/admin/lib/form";

export async function updateOrder(id: number, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const status = z.enum(ORDER_STATUSES).safeParse(str(fd, "status"));
  if (!status.success) return { error: "Nepoznat status." };
  await db.update(orders).set({ status: status.data, adminNote: str(fd, "adminNote") }).where(eq(orders.id, id));
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateInquiry(id: number, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireSession();
  const status = z.enum(INQUIRY_STATUSES).safeParse(str(fd, "status"));
  if (!status.success) return { error: "Nepoznat status." };
  await db.update(inquiries).set({ status: status.data }).where(eq(inquiries.id, id));
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteInquiry(id: number): Promise<{ error?: string }> {
  await requireSession();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin", "layout");
  return {};
}
