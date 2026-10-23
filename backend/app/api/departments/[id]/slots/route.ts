import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const serviceId = params.id;
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ message: 'Date is required.' }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { hospitalId: true }
    });

    if (!service) {
      return NextResponse.json({ message: 'Service not found.' }, { status: 404 });
    }

    const startDate = new Date(dateStr);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    endDate.setUTCHours(23, 59, 59, 999);

    // Fetch doctors for this hospital
    const doctors = await prisma.doctor.findMany({
      where: { hospitalId: service.hospitalId },
      select: { id: true, name: true, specialty: true }
    });

    // Fetch slots for this hospital on the given date
    const slots = await prisma.timeSlot.findMany({
      where: {
        hospitalId: service.hospitalId,
        startTime: {
          gte: startDate,
          lt: endDate,
        }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        doctorId: true
      },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json({ doctors, slots });
  } catch (error) {
    console.error(`Error fetching slots for service ${serviceId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
