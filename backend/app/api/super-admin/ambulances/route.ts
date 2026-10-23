// app/api/super-admin/ambulances/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function isSuperAdmin() {
  const session = (await getServerSession(authOptions as any)) as any;
  return !!session && session.user.role === Role.SUPER_ADMIN;
}

// 📦 GET — Fetch pending ambulances
export async function GET(req: Request) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: "Access denied. Must be a Super Admin." }, { status: 403 });
  }

  try {
    const pendingAmbulances = await prisma.ambulance.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pendingAmbulances);
  } catch (error) {
    console.error("🚨 Error fetching ambulances:", error);
    return NextResponse.json(
      { message: "Failed to fetch ambulances", error: (error as any).message },
      { status: 500 }
    );
  }
}


// 🟢 POST — Approve or Reject ambulance
export async function POST(req: Request) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: "Access denied. Must be a Super Admin." }, { status: 403 });
  }

  try {
    const { ambulanceId, action } = await req.json();

    if (!ambulanceId || !action)
      return NextResponse.json({ msg: "Missing fields" }, { status: 400 });

    const newStatus =
      action === "APPROVE"
        ? "APPROVED"
        : action === "REJECT"
        ? "REJECTED"
        : "PENDING_REVIEW";

    const updated = await prisma.ambulance.update({
      where: { id: ambulanceId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      msg: `Ambulance ${action.toLowerCase()}d successfully`,
      ambulance: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Failed to update status" }, { status: 500 });
  }
}
