import { and, count, desc, eq, gte, sum } from "drizzle-orm";
import { db } from "@/db";
import { events, inquiries, orders, type SiteEvent } from "@/db/schema";

// Statistika za vlasnika (owner): klikovi na kontakt + narudžbe i upiti po periodu.
// Admin čitanje — bez keša, uvek sveže.

export const CHANNELS = ["poziv", "viber", "whatsapp", "email", "instagram"] as const;
export type Channel = (typeof CHANNELS)[number];

export interface PeriodStats {
  label: string;
  days: number;
  clicks: Record<Channel, number>;
  clicksTotal: number;
  orders: number;
  revenue: number;
  inquiries: number;
}

const PERIODS: { label: string; days: number }[] = [
  { label: "Danas", days: 1 },
  { label: "7 dana", days: 7 },
  { label: "30 dana", days: 30 },
];

function since(days: number): Date {
  const d = new Date();
  if (days === 1) d.setHours(0, 0, 0, 0);
  else d.setDate(d.getDate() - days);
  return d;
}

async function periodStats(label: string, days: number): Promise<PeriodStats> {
  const from = since(days);
  const [byChannel, [o], [q]] = await Promise.all([
    db
      .select({ channel: events.channel, n: count() })
      .from(events)
      .where(and(eq(events.name, "kontakt"), gte(events.createdAt, from)))
      .groupBy(events.channel),
    db.select({ n: count(), s: sum(orders.total) }).from(orders).where(gte(orders.createdAt, from)),
    db.select({ n: count() }).from(inquiries).where(gte(inquiries.createdAt, from)),
  ]);
  const clicks = Object.fromEntries(CHANNELS.map((c) => [c, 0])) as Record<Channel, number>;
  for (const r of byChannel) if (r.channel in clicks) clicks[r.channel as Channel] = r.n;
  return {
    label,
    days,
    clicks,
    clicksTotal: Object.values(clicks).reduce((a, b) => a + b, 0),
    orders: o?.n ?? 0,
    revenue: Number(o?.s ?? 0),
    inquiries: q?.n ?? 0,
  };
}

export async function getStats(): Promise<{ periods: PeriodStats[]; recent: SiteEvent[] }> {
  const [periods, recent] = await Promise.all([
    Promise.all(PERIODS.map((p) => periodStats(p.label, p.days))),
    db.select().from(events).orderBy(desc(events.createdAt)).limit(100),
  ]);
  return { periods, recent };
}
