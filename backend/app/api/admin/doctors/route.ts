import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { Role } from '@prisma/client';
import { authOptions } from '@/lib/auth';

interface DoctorInput {
    name: string;
    specialty: string;
}

export async function GET(request: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);


        if (!session?.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
            return NextResponse.json({ message: 'Authorization required. Must be a Hospital Admin.' }, { status: 403 });
        }

        const doctors = await prisma.doctor.findMany({
            where: {
                hospitalId: session.user.hospitalId,
            },
            select: {
                id: true,
                name: true,
                specialty: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(doctors, { status: 200 });

    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({ message: 'Internal Server Error fetching doctor data.' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const session: any = await getServerSession(authOptions as any);

        if (!session?.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
            return NextResponse.json({ message: 'Authorization required. Must be a Hospital Admin.' }, { status: 403 });
        }

        const body: DoctorInput = await request.json();
        const { name, specialty } = body;

        if (!name || !specialty) {
            return NextResponse.json({ message: 'Doctor name and specialty are required.' }, { status: 400 });
        }

        const newDoctor = await prisma.doctor.create({
            data: {
                name,
                specialty,
                hospitalId: session.user.hospitalId, 
            },
        });

        return NextResponse.json(newDoctor, { status: 201 });

    } catch (error) {
        console.error('Error creating new doctor:', error);
        return NextResponse.json({ message: 'Internal Server Error while creating doctor.' }, { status: 500 });
    }
}
