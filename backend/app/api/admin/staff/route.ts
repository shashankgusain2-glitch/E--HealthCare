import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { authOptions } from '@/lib/auth';

async function getAdminSession() {
    const session: any = await getServerSession(authOptions as any);

    if (!session || !session.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
        return null;
    }
    return session.user as { id: string; role: Role; hospitalId: string; };
}

export async function POST(request: Request) {
    const admin = await getAdminSession();
    if (!admin) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { email, role, doctorId } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ message: 'Email and role are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found in system' }, { status: 404 });
        }

        const updateData: any = { role, hospitalId: admin.hospitalId };

        if (role === 'DOCTOR' && doctorId) {
            // Must verify the doctor belongs to this hospital
            const doctor = await prisma.doctor.findFirst({
                where: { id: doctorId, hospitalId: admin.hospitalId }
            });
            if (!doctor) {
                return NextResponse.json({ message: 'Invalid Doctor ID' }, { status: 400 });
            }
            updateData.doctorId = doctorId;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        if (role === 'DOCTOR' && doctorId) {
            await prisma.doctor.update({
                where: { id: doctorId },
                data: { userId: user.id }
            });
        }

        return NextResponse.json({ message: 'Staff role updated successfully', user: updatedUser }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating staff:", error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const admin = await getAdminSession();
    if (!admin) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const staff = await prisma.user.findMany({
            where: {
                hospitalId: admin.hospitalId,
                role: { in: ['HOSPITAL_STAFF', 'DOCTOR'] }
            },
            select: {
                id: true, name: true, email: true, role: true,
                doctor: { select: { name: true, specialty: true } }
            }
        });

        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
