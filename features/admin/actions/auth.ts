"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Unesite email i lozinku." };

  const { email, password, next } = parsed.data;
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase())).limit(1);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) return { error: "Pogrešan email ili lozinka." };

  await createSession({ userId: user.id, email: user.email, name: user.name });

  // Samo relativna putanja unutar admina — bez open redirect-a.
  const target = next && /^\/admin(\/|$)/.test(next) ? next : "/admin";
  redirect(target);
}

export async function logout() {
  await destroySession();
  redirect("/admin/prijava");
}
