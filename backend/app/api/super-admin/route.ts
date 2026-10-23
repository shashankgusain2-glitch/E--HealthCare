import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Role, HospitalStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Access denied. Must be a Super Admin." }, { status: 403 });
  }

  try {
    const pendingHospitals = await prisma.hospital.findMany({
      where: { status: HospitalStatus.PENDING_REVIEW },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(pendingHospitals, { status: 200 });
  } catch (error) {
    console.error("Super Admin GET error:", error);
    return NextResponse.json({ msg: "Internal server error fetching hospitals." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Access denied. Must be a Super Admin." }, { status: 403 });
  }

  const { hospitalId, adminEmail, action } = await request.json();

  if (!hospitalId || !adminEmail || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ msg: "Missing required fields or invalid action." }, { status: 400 });
  }

  try {
    const newStatus = action === "APPROVE" ? HospitalStatus.APPROVED : HospitalStatus.REJECTED;

    if (action === "APPROVE") {
      await prisma.$transaction(async (tx) => {
        await tx.hospital.update({
          where: { id: hospitalId },
          data: { status: newStatus },
        });

        await tx.user.update({
          where: { email: adminEmail },
          data: {
            role: Role.HOSPITAL_ADMIN,
            hospitalId,
          },
        });
      });

      return NextResponse.json(
        { msg: `Hospital ${hospitalId} approved and Admin (${adminEmail}) promoted.`, hospitalId },
        { status: 200 }
      );
    } else {
      await prisma.hospital.update({
        where: { id: hospitalId },
        data: { status: newStatus },
      });
      return NextResponse.json({ msg: `Hospital ${hospitalId} rejected.` }, { status: 200 });
    }
  } catch (error) {
    console.error("Super Admin POST error:", error);
    return NextResponse.json({ msg: "Internal server error processing application." }, { status: 500 });
  }
}
