import { NextResponse } from "next/server";

// Read FRONTEND_URL on every request rather than baking the build-time value in.
export const dynamic = "force-dynamic";

// The backend has no pages. Its root address only confirms the API is running
// and points people to the website.
export function GET() {
  return NextResponse.json({
    service: "HealthCare+ API",
    status: "running",
    website: process.env.FRONTEND_URL || "http://localhost:3000",
  });
}
