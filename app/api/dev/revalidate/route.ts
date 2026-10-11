import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { TAGS } from "@/lib/cacheTags";

// Samo u developmentu: posle ručnog seed-a ili SQL-a keš ne zna za promenu.
// GET /api/dev/revalidate            → svi tagovi
// GET /api/dev/revalidate?tag=settings
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const tag = new URL(request.url).searchParams.get("tag");
  const tags = tag ? [tag] : Object.values(TAGS);
  for (const t of tags) revalidateTag(t, { expire: 0 });
  return NextResponse.json({ revalidated: tags });
}
