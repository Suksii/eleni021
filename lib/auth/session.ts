import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, type AdminRole } from "@/db/schema";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

export interface AdminSession {
  userId: number;
  email: string;
  name: string;
  role: AdminRole;
}

const secret = () => new TextEncoder().encode(env.authSecret);

export async function createSession(session: AdminSession) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.userId !== "number") return null;
    return {
      userId: payload.userId,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role === "owner" ? "owner" : "admin",
    };
  } catch {
    return null;
  }
}

// Za server akcije: baca ako nema sesije — svaka CMS mutacija ovo zove prvo.
export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error("Niste prijavljeni.");
  return session;
}

// Uloga se čita iz baze, ne iz JWT-a: sesija traje 7 dana, a promena uloge
// (ili brisanje naloga) mora da važi odmah.
export async function getRole(userId: number): Promise<AdminRole | null> {
  const [u] = await db.select({ role: adminUsers.role }).from(adminUsers).where(eq(adminUsers.id, userId)).limit(1);
  return u?.role ?? null;
}

// Samo vlasnik sajta (programer): statistika i slično što klijent ne vidi.
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireSession();
  if ((await getRole(session.userId)) !== "owner") throw new Error("Nemate pristup.");
  return { ...session, role: "owner" };
}
