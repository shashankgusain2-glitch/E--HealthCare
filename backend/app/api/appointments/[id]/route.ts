import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        hospital: { select: { name: true, city: true, address: true } },
        doctor: { select: { name: true, specialty: true } },
        service: { select: { name: true, price: true } },
        patient: { select: { name: true, email: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    // Only allow the patient themselves to view
    if (appointment.patientId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
