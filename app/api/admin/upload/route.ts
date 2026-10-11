import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth/session";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

// Upload slika iz CMS-a — vraća javni URL. Sa `BLOB_READ_WRITE_TOKEN` (Vercel)
// ide u Vercel Blob, jer je fajl-sistem na Vercel-u read-only; lokalno u
// `public/uploads`.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Nema fajla." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Slika je veća od 8 MB." }, { status: 413 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Dozvoljeni su JPG, PNG, WEBP, AVIF i GIF." }, { status: 415 });

  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}` });
}
