import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region") || undefined;
    const available = searchParams.get("available");
    const hospitalId = searchParams.get("hospitalId") || undefined;

    const isAvailable =
      available === null
        ? undefined
        : available?.toLowerCase() === "true"
        ? true
        : available?.toLowerCase() === "false"
        ? false
        : undefined;

    const ambulances = await prisma.ambulance.findMany({
      where: {
        status: "APPROVED", 
        region: region ? { contains: region, mode: "insensitive" } : undefined,
        isAvailable: isAvailable,
        hospitalId: hospitalId,
      },
      include: {
        hospital: { select: { id: true, name: true, city: true, phone: true } },
      },
      orderBy: [{ isAvailable: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(ambulances, { status: 200 });
  } catch (e) {
    console.error("GET /api/ambulances error:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      driverName,
      licensePlate,
      contactNumber,
      region,
      hospitalId, 
    } = body || {};

    if (!driverName || !licensePlate || !contactNumber || !region) {
      return NextResponse.json(
        { message: "driverName, licensePlate, contactNumber, and region are required." },
        { status: 400 }
      );
    }

    const plate = String(licensePlate).trim().toUpperCase();

    const newAmbulance = await prisma.ambulance.create({
      data: {
        driverName: String(driverName).trim(),
        licensePlate: plate,
        contactNumber: String(contactNumber).trim(),
        region: String(region).trim(),
        hospitalId: hospitalId || null,
        isAvailable: true, 
      },
    });

    return NextResponse.json(newAmbulance, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/ambulances error:", e);
    if (e.code === "P2002") {
      return NextResponse.json(
        { message: "An ambulance with this license plate already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
