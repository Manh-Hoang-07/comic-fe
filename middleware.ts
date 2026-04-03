import { NextRequest, NextResponse } from "next/server";

function hasAuthToken(req: NextRequest) {
  // Nuxt đang dùng cookie "auth_token"
  return Boolean(req.cookies.get("auth_token")?.value);
}

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const { pathname } = req.nextUrl;
  const authed = hasAuthToken(req);

  let response: NextResponse;

  // Protect /admin/** (Nuxt middleware: always guard /admin)
  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  }
  // If already authenticated, prevent visiting /login or /register
  else if (authed && (pathname === "/login" || pathname === "/register")) {
    const url = req.nextUrl.clone();
    url.pathname = "/user";
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  const duration = Date.now() - start;
  if (duration > 50) {
    // Took too long
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};







