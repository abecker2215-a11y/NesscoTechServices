import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "nesscotech.com";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = url.hostname;

  // Skip middleware for localhost/development
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
    return NextResponse.next();
  }

  // Redirect www to non-www
  if (host.startsWith("www.")) {
    const newUrl = new URL(request.url);
    newUrl.hostname = CANONICAL_HOST;
    newUrl.port = "";
    return NextResponse.redirect(newUrl, 301);
  }

  // Ensure HTTPS in production (only for actual domain, not localhost)
  if (process.env.NODE_ENV === "production" && url.protocol === "http:" && host !== "localhost") {
    const newUrl = new URL(request.url);
    newUrl.protocol = "https:";
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json
     * - sw.js (service worker)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)",
  ],
};