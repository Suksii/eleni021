import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, type Order } from "@/db/schema";

// Bez keša — narudžba je per-korisnik, strana je dinamična iza Suspense-a.
export async function getOrderByCode(code: string): Promise<Order | null> {
  const [row] = await db.select().from(orders).where(eq(orders.code, code)).limit(1);
  return row ?? null;
}
