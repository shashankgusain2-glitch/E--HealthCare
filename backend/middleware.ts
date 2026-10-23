import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// API access by role, on top of the session checks inside individual routes.
// Being an API, it answers with JSON errors instead of redirecting to a page.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/api/appointments") && token.role !== "PATIENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (pathname.startsWith("/api/super-admin") && token.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/appointments/:path*", "/api/super-admin/:path*"],
};
