import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id || session.user.role !== 'PATIENT') {
    return NextResponse.json({ message: "Only patients can book appointments" }, { status: 401 });
  }
  const patientId = session.user.id;

  try {
    const body = await request.json();
    const {
      hospitalId,
      doctorId,
      serviceId,
      timeSlotId,
      startTime,
      endTime,
      type,
      notes,
    } = body;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    // Razorpay Order Creation
    const options = {
      amount: service.price, // Assuming price is in paise (INR * 100)
      currency: "INR",
      receipt: `receipt_apt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Sanitize doctorId (handle special cases like 'general')
    const finalDoctorId = (doctorId === 'video-doc' || doctorId === 'general' || !doctorId) ? null : doctorId;

    // Use transaction to create appointment and lock slot if necessary
    const newAppointment = await prisma.$transaction(async (tx) => {
      // If a specific timeSlotId is provided, mark it as booked
      if (timeSlotId) {
        const slot = await tx.timeSlot.findUnique({ where: { id: timeSlotId } });
        if (!slot || slot.isBooked) {
          throw new Error("Slot is no longer available.");
        }
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: { isBooked: true }
        });
      }

      return await tx.appointment.create({
        data: {
          patientId,
          hospitalId,
          doctorId: finalDoctorId,
          serviceId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          type,
          notes: notes || "",
          paymentStatus: "PENDING",
          status: "PENDING",
          razorpayOrderId: razorpayOrder.id,
        },
      });
    });

    return NextResponse.json({
      appointment: newAppointment,
      razorpayOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
