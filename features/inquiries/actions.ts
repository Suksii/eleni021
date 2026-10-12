"use server";

import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cateringPackages, inquiries, INQUIRY_TYPES } from "@/db/schema";
import { sendInquiryEmails } from "@/features/inquiries/email";

export interface InquiryState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const schema = z.object({
  type: z.enum(INQUIRY_TYPES),
  name: z.string().trim().min(2, "Unesite ime i prezime.").max(120),
  phone: z.string().trim().min(6, "Unesite broj telefona.").max(40),
  email: z.string().trim().email("Unesite ispravan email.").max(160).or(z.literal("")),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
  persons: z.coerce.number().int().min(0).max(5000).optional(),
  packageId: z.coerce.number().int().positive().optional(),
  message: z.string().trim().max(3000),
  // Honeypot — bot popunjava, čovjek ne vidi.
  website: z.string().max(0).optional(),
});

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse({
    ...raw,
    persons: raw.persons ? raw.persons : undefined,
    packageId: raw.packageId ? raw.packageId : undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Proverite označena polja.", fieldErrors };
  }

  const d = parsed.data;
  if (d.website) return { ok: true };

  // Paket iz forme može biti zastario (obrisan u CMS-u) — tada upit ide bez paketa.
  let packageId: number | null = null;
  let packageName: string | null = null;
  if (d.packageId) {
    const [pkg] = await db
      .select({ id: cateringPackages.id, name: cateringPackages.name })
      .from(cateringPackages)
      .where(eq(cateringPackages.id, d.packageId))
      .limit(1);
    packageId = pkg?.id ?? null;
    packageName = pkg?.name ?? null;
  }

  const values = {
    type: d.type,
    name: d.name,
    phone: d.phone,
    email: d.email,
    eventDate: d.eventDate || null,
    persons: d.persons ?? null,
    message: d.message,
  };

  try {
    await db.insert(inquiries).values({ ...values, packageId });
  } catch (e) {
    console.error("submitInquiry:", e);
    return { ok: false, error: "Slanje nije uspelo. Pokušajte ponovo ili nas pozovite." };
  }

  // Emailovi (vlasniku + pošiljaocu) posle odgovora; neuspeh ne poništava upit.
  after(() => sendInquiryEmails({ ...values, packageName }));

  return { ok: true };
}
