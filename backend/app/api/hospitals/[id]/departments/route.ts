import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const hospitalId = params.id;

  try {
    const services = await prisma.service.findMany({
      where: { hospitalId },
      select: {
        id: true,
        name: true,
        price: true
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(`Error fetching services for hospital ${hospitalId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
