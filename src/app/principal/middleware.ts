import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token") || req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token && req.nextUrl.pathname.startsWith("/principal")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/principal/:path*"], // Proteger todas las páginas dentro de /principal
};
