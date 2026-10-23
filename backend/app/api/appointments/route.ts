import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Role, AppointmentStatus, Prisma } from '@prisma/client';


export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;

 
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized: You must be logged in to book.' }, { status: 401 });
  }
  
  const patientId = session.user.id as string;

  try {
    const body = await request.json();
    const {
      hospitalId,
      doctorId,
      serviceId,
      type,
      startTime,
      endTime,
      timeSlotId, 
      notes
    } = body;

    if (!hospitalId || !doctorId || !serviceId || !type || !startTime || !endTime || !timeSlotId) {
      return NextResponse.json({ message: 'Missing required booking information.' }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

   
    // transaction
    // 1. Mark the TimeSlot as booked (and check if it's already booked).
    // 2. Create the Appointment record.
    // If either fails, the whole thing rolls back.
    
    const newAppointment = await prisma.$transaction(async (tx) => {
      
      const bookedSlot = await tx.timeSlot.update({
        where: {
          id: timeSlotId,
          isBooked: false, 
        },
        data: {
          isBooked: true,
        }
      });

     
      const appointment = await tx.appointment.create({
        data: {
          patientId: patientId,
          hospitalId: hospitalId,
          doctorId: doctorId,
          serviceId: serviceId,
          type: type,
          status: AppointmentStatus.PENDING,
          paymentStatus: "PENDING", 
          startTime: start,
          endTime: end,
          notes: notes || null,
        }
      });

      return appointment;
    });

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Booking failed: This time slot was just booked by another user. Please select a different slot.' }, { status: 409 });
      }
    }

    console.error("Error creating appointment:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}