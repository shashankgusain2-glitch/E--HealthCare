import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendPrescriptionEmail } from '@/lib/mail';

export async function POST(
    request: Request,
    { params }: { params: { appointmentId: string } }
) {
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: session.user.id }
        });

        if (!doctor) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { patientId, medications, notes } = await request.json();
        const { appointmentId } = params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId, doctorId: doctor.id },
            include: {
                patient: true,
                hospital: true,
                doctor: true,
            }
        });

        if (!appointment) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
        }

        // Save prescription
        const prescription = await prisma.prescription.create({
            data: {
                appointmentId,
                patientId,
                doctorId: doctor.id,
                medications,
                notes,
            }
        });

        // Mark appointment as COMPLETED if not already
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
        });

        // Send email
        await sendPrescriptionEmail(prescription, appointment.patient, appointment.doctor, appointment.hospital);

        return NextResponse.json(prescription, { status: 201 });
    } catch (error) {
        console.error("Error creating prescription:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
