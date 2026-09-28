import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";
import { ADMIN_BASE } from "@/lib/admin-config";

const PUBLIC_ADMIN_PATHS = [`${ADMIN_BASE}/login`, `${ADMIN_BASE}/setup`];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let res: NextResponse;
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    res = NextResponse.next();
  } else {
    const ok = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
    res = ok
      ? NextResponse.next()
      : NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, req.url));
  }

  // Keep the whole admin area out of search engines
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/vercel/203695/209/admin/:path*", "/vercel/203695/209/admin"],
};
