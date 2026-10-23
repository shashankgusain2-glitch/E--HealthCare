import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { HospitalStatus } from '@prisma/client';

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: { status: HospitalStatus.APPROVED },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        phone: true,
        emergencyServices: true,
        isGovernment: true,
        services: {
          select: {
            name: true
          }
        }
      }
    });

    // Map to include specialties (unique service names)
    const hospitalsWithSpecialties = hospitals.map(hospital => ({
      ...hospital,
      specialties: Array.from(new Set(hospital.services.map(s => s.name)))
    }));

    return NextResponse.json(hospitalsWithSpecialties);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
