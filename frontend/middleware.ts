import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Page access by role. API routes are guarded separately by backend/middleware.ts.
// Visitors who aren't signed in are sent to /login (and back afterwards);
// signed-in users with the wrong role are sent to /unauthorized.
export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/appointments")) {
      if (!token || token.role !== "PATIENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/HospitalAdminPanel")) {
      const isHospitalUser = token?.role === "HOSPITAL_ADMIN" || token?.role === "HOSPITAL_STAFF";
      if (!token || !isHospitalUser || !token.hospitalId) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/super-admin")) {
      if (!token || token.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/doctor")) {
      if (!token || token.role !== "DOCTOR") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // /consultation is open to any signed-in user, which `authorized` below already enforces.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/appointments/:path*",
    "/HospitalAdminPanel/:path*",
    "/super-admin/:path*",
    "/doctor/:path*",
    "/consultation/:path*",
  ],
};
