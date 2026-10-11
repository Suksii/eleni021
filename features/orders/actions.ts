"use server";

import { randomInt } from "node:crypto";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { DELIVERY_TYPES, orders, products, type OrderItem } from "@/db/schema";

export interface CheckoutState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999),
});

const schema = z.object({
  customerName: z.string().trim().min(2, "Unesite ime i prezime.").max(120),
  phone: z.string().trim().min(6, "Unesite broj telefona.").max(40),
  email: z.string().trim().email("Unesite ispravan email.").max(160).or(z.literal("")),
  deliveryType: z.enum(DELIVERY_TYPES),
  address: z.string().trim().max(300),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Izaberite datum."),
  note: z.string().trim().max(2000),
  items: z.array(itemSchema).min(1, "Korpa je prazna."),
  deliveryFee: z.number().min(0),
});

function orderCode(): string {
  const d = new Date();
  const ym = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `EL-${ym}-${randomInt(1000, 9999)}`;
}

function fieldErrorsOf(issues: z.ZodIssue[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "");
    if (key && !out[key]) out[key] = i.message;
  }
  return out;
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  const parsed = schema.safeParse({
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    deliveryType: formData.get("deliveryType"),
    address: formData.get("address") ?? "",
    deliveryDate: formData.get("deliveryDate"),
    note: formData.get("note") ?? "",
    items,
    deliveryFee: Number(formData.get("deliveryFee") ?? 0),
  });

  if (!parsed.success) {
    return { error: "Proverite označena polja.", fieldErrors: fieldErrorsOf(parsed.error.issues) };
  }
  const d = parsed.data;

  if (d.deliveryType === "dostava" && d.address.length < 5) {
    return { error: "Proverite označena polja.", fieldErrors: { address: "Unesite adresu za dostavu." } };
  }

  // Datum ne sme biti pre najdužeg roka izrade među artiklima (provera niže).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(d.deliveryDate);
  if (date < today) {
    return { error: "Proverite označena polja.", fieldErrors: { deliveryDate: "Datum ne može biti u prošlosti." } };
  }

  // Cene se uzimaju iz baze, nikad iz klijenta.
  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.id, d.items.map((i) => i.productId)));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const orderItems: OrderItem[] = [];
  let maxLead = 0;
  for (const it of d.items) {
    const p = byId.get(it.productId);
    if (!p || !p.active) return { error: "Neki proizvodi iz korpe više nisu dostupni. Osvežite korpu." };
    maxLead = Math.max(maxLead, p.leadTimeDays);
    orderItems.push({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0] ?? "",
      unit: p.unit,
      price: p.price,
      quantity: Math.max(it.quantity, p.minQuantity),
    });
  }

  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() + maxLead);
  if (date < earliest) {
    return {
      error: "Proverite označena polja.",
      fieldErrors: { deliveryDate: `Za artikle iz korpe najraniji datum je ${earliest.toLocaleDateString("sr-Latn-RS")}.` },
    };
  }

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const fee = d.deliveryType === "dostava" ? d.deliveryFee : 0;
  const total = Math.round((subtotal + fee) * 100) / 100;

  let code = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    code = orderCode();
    try {
      await db.insert(orders).values({
        code,
        customerName: d.customerName,
        phone: d.phone,
        email: d.email,
        deliveryType: d.deliveryType,
        address: d.deliveryType === "dostava" ? d.address : "",
        deliveryDate: d.deliveryDate,
        note: d.note,
        items: orderItems,
        total,
      });
      break;
    } catch (e) {
      if (attempt === 4) {
        console.error(e);
        return { error: "Narudžba nije sačuvana. Pokušajte ponovo ili nas pozovite." };
      }
    }
  }

  redirect(`/narudzba/${code}`);
}
