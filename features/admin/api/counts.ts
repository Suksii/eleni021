import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, orders } from "@/db/schema";

// Admin čitanja nisu keširana — uvek sveže iz baze.
export async function getNewCounts() {
  const [[o], [i]] = await Promise.all([
    db.select({ n: count() }).from(orders).where(eq(orders.status, "novo")),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "novo")),
  ]);
  return { orders: o?.n ?? 0, inquiries: i?.n ?? 0 };
}
