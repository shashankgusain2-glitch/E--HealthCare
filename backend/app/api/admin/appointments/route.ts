import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role, AppointmentStatus, AppointmentType } from '@prisma/client';
import { randomUUID } from 'crypto';

async function getAdminSession() {
  const session: any = await getServerSession(authOptions as any);

  if (!session || !session.user || !session.user.hospitalId ||
    (session.user.role !== Role.HOSPITAL_ADMIN && session.user.role !== Role.HOSPITAL_STAFF)) {
    return null;
  }
  return session.user as { id: string; role: Role; hospitalId: string; };
}

export async function GET(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        hospitalId: admin.hospitalId,
        paymentStatus: 'PAID'
      },
      include: {
        patient: {
          select: { name: true, email: true }
        },
        doctor: {
          select: { name: true, specialty: true }
        },
        service: {
          select: { name: true, price: true }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(appointments, { status: 200 });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { appointmentId, status } = await request.json();

    if (!appointmentId || !status) {
      return NextResponse.json({ message: 'Appointment ID and new status are required.' }, { status: 400 });
    }

    if (!Object.values(AppointmentStatus).includes(status)) {
      return NextResponse.json({ message: 'Invalid status provided.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        hospitalId: admin.hospitalId,
      }
    });

    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found or you do not have permission.' }, { status: 404 });
    }

    let videoLink: string | null = appointment.videoLink;


    if (status === AppointmentStatus.CONFIRMED && appointment.type === AppointmentType.VIDEO_CALL && !appointment.videoLink) {
      videoLink = `${process.env.FRONTEND_URL}/consultation?roomID=${randomUUID()}`;
    }

    if (status === AppointmentStatus.CANCELED) {
      await prisma.timeSlot.updateMany({
        where: {
          hospitalId: admin.hospitalId,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          doctorId: appointment.doctorId,
        },
        data: {
          isBooked: false
        }
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: status,
        videoLink: videoLink,
      },
      include: {
        patient: { select: { name: true, email: true } },
        doctor: { select: { name: true, specialty: true } },
        service: { select: { name: true, price: true } }
      }
    });

    return NextResponse.json(updatedAppointment, { status: 200 });

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}