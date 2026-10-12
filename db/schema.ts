import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const PRODUCT_UNITS = ["kom", "kg", "porcija", "set"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export const ORDER_STATUSES = [
  "novo",
  "potvrdjeno",
  "u_izradi",
  "zavrseno",
  "otkazano",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DELIVERY_TYPES = ["preuzimanje", "dostava"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const INQUIRY_TYPES = ["ketering", "kontakt", "torta_po_zelji"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = ["novo", "odgovoreno", "arhivirano"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2, mode: "number" })
    .notNull()
    .default(0),
  unit: text("unit").$type<ProductUnit>().notNull().default("kom"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  servings: text("servings").notNull().default(""),
  allergens: text("allergens").notNull().default(""),
  leadTimeDays: integer("lead_time_days").notNull().default(2),
  minQuantity: integer("min_quantity").notNull().default(1),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const cateringPackages = pgTable("catering_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  pricePerPerson: numeric("price_per_person", {
    precision: 10,
    scale: 2,
    mode: "number",
  })
    .notNull()
    .default(0),
  minPersons: integer("min_persons").notNull().default(10),
  items: jsonb("items").$type<string[]>().notNull().default([]),
  image: text("image").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamps.createdAt,
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  occasion: text("occasion").notNull().default(""),
  text: text("text").notNull(),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamps.createdAt,
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamps.updatedAt,
});

export interface OrderItem {
  productId: number;
  name: string;
  slug: string;
  image: string;
  unit: ProductUnit;
  price: number;
  quantity: number;
}

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  deliveryType: text("delivery_type").$type<DeliveryType>().notNull(),
  address: text("address").notNull().default(""),
  deliveryDate: date("delivery_date").notNull(),
  note: text("note").notNull().default(""),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  total: numeric("total", { precision: 10, scale: 2, mode: "number" }).notNull(),
  status: text("status").$type<OrderStatus>().notNull().default("novo"),
  adminNote: text("admin_note").notNull().default(""),
  ...timestamps,
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: text("type").$type<InquiryType>().notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  eventDate: date("event_date"),
  persons: integer("persons"),
  packageId: integer("package_id").references(() => cateringPackages.id, {
    onDelete: "set null",
  }),
  message: text("message").notNull().default(""),
  status: text("status").$type<InquiryStatus>().notNull().default("novo"),
  ...timestamps,
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamps.createdAt,
});

// Ograničenje pokušaja prijave u admin — po IP-u i po emailu (serverless nema
// trajnu memoriju, pa brojač živi u bazi). Vidi lib/auth/loginAttempts.ts.
export const loginAttempts = pgTable("login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  blockedUntil: timestamp("blocked_until", { withTimezone: true }),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CateringPackage = typeof cateringPackages.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
