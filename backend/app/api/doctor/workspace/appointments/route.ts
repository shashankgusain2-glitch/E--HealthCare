import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { userId: session.user.id }
        });

        if (!doctor) {
            return NextResponse.json({ message: 'Forbidden: You are not a doctor' }, { status: 403 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setDate(today.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctor.id,
                startTime: {
                    gte: today,
                    lt: endOfToday,
                },
            },
            include: {
                patient: {
                    select: { name: true, phone: true, email: true }
                },
                service: {
                    select: { name: true }
                },
                prescription: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
