import { asc, count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import {
  categories, cateringPackages, galleryImages, inquiries, orders, products, settings, testimonials,
  type InquiryStatus, type OrderStatus,
} from "@/db/schema";

// Admin čitanja — direktno iz baze, bez `use cache`.

export async function adminProducts() {
  return db
    .select({ product: products, categoryName: categories.name })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(products.sortOrder), desc(products.createdAt));
}

export async function adminProduct(id: number) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export async function adminCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function adminCategory(id: number) {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}

export async function adminPackages() {
  return db.select().from(cateringPackages).orderBy(asc(cateringPackages.sortOrder), asc(cateringPackages.name));
}

export async function adminPackage(id: number) {
  const [row] = await db.select().from(cateringPackages).where(eq(cateringPackages.id, id)).limit(1);
  return row ?? null;
}

export async function adminGallery() {
  return db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
}

export async function adminTestimonials() {
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
}

export async function adminTestimonial(id: number) {
  const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return row ?? null;
}

export async function adminOrders(status?: OrderStatus) {
  return db
    .select()
    .from(orders)
    .where(status ? eq(orders.status, status) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);
}

export async function adminOrder(id: number) {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row ?? null;
}

export async function adminInquiries(status?: InquiryStatus) {
  return db
    .select({ inquiry: inquiries, packageName: cateringPackages.name })
    .from(inquiries)
    .leftJoin(cateringPackages, eq(inquiries.packageId, cateringPackages.id))
    .where(status ? eq(inquiries.status, status) : undefined)
    .orderBy(desc(inquiries.createdAt))
    .limit(200);
}

export async function adminInquiry(id: number) {
  const [row] = await db
    .select({ inquiry: inquiries, packageName: cateringPackages.name })
    .from(inquiries)
    .leftJoin(cateringPackages, eq(inquiries.packageId, cateringPackages.id))
    .where(eq(inquiries.id, id))
    .limit(1);
  return row ?? null;
}

export async function adminSettingsMap() {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}

export async function dashboardStats() {
  const [[o], [i], [p], [rev], recent, recentInq] = await Promise.all([
    db.select({ n: count() }).from(orders).where(eq(orders.status, "novo")),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "novo")),
    db.select({ n: count() }).from(products).where(eq(products.active, true)),
    db.select({ s: sum(orders.total) }).from(orders).where(eq(orders.status, "zavrseno")),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(6),
  ]);
  return {
    newOrders: o?.n ?? 0,
    newInquiries: i?.n ?? 0,
    activeProducts: p?.n ?? 0,
    revenue: Number(rev?.s ?? 0),
    recentOrders: recent,
    recentInquiries: recentInq,
  };
}
