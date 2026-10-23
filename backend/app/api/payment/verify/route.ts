import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
  } = body;

  // 1. Verify the signature
  const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(bodyString)
    .digest("hex");

  const isSignatureValid = expectedSignature === razorpay_signature;

  if (!isSignatureValid) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (appointment) {
        await prisma.$transaction([
          prisma.appointment.update({
            where: { id: appointmentId },
            data: {
              paymentStatus: "FAILED",
              status: "CANCELED"
            },
          }),
          prisma.timeSlot.updateMany({
            where: {
              hospitalId: appointment.hospitalId,
              doctorId: appointment.doctorId,
              startTime: appointment.startTime,
            },
            data: { isBooked: false },
          }),
        ]);
      }
    } catch (rollBackError) {
      console.error("Rollback failed:", rollBackError);
    }
    return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
  }

  // 2. Signature is valid. Update the Appointment and Send Email.
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
      }
    });

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    let videoLink = appointment.videoLink;
    if (appointment.type === "VIDEO_CALL" && !videoLink) {
      videoLink = `${process.env.FRONTEND_URL}/consultation?roomID=${appointment.id}`;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentStatus: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        videoLink,
        status: "CONFIRMED", // Auto-confirm after payment
      },
      include: {
        patient: { select: { name: true, email: true } },
        hospital: { select: { name: true } },
        doctor: { select: { name: true, specialty: true } },
        service: true,
      }
    });

    // Send confirmation email asynchronously
    sendBookingConfirmation(updatedAppointment).catch(err => {
      console.error("Failed to send confirmation email:", err);
    });

    return NextResponse.json({
      message: "Payment verified and appointment confirmed",
      appointment: updatedAppointment,
    }, { status: 200 });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}