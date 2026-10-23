import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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

        const { action } = await request.json();
        const { appointmentId } = params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId, doctorId: doctor.id }
        });

        if (!appointment) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
        }

        const now = new Date();
        let updatedAppointment;

        if (action === 'START') {
            updatedAppointment = await prisma.appointment.update({
                where: { id: appointmentId },
                data: { actualStartTime: now },
            });
        } else if (action === 'STOP') {
            updatedAppointment = await prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    actualEndTime: now,
                    status: 'COMPLETED'
                },
            });
        } else {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        console.error("Error updating timer:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
