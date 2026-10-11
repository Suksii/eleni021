import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const PUBLIC_ADMIN = ["/admin/prijava"];

// Optimistička provjera — samo prisustvo cookie-ja. Pravu verifikaciju JWT-a
// radi admin layout (`getSession`), a svaka server akcija `requireSession`.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (PUBLIC_ADMIN.includes(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return;
  }

  if (hasSession) return;

  const url = new URL("/admin/prijava", request.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
