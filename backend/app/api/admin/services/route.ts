import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { Role, Prisma } from '@prisma/client'; 
import { authOptions } from '@/lib/auth';

async function getAdminSession() {
  const session = await getServerSession(authOptions as any) as any;
  
  if (!session || !session.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
    return null;
  }
  return session.user as { id: string; role: Role; hospitalId: string; };
}

export async function GET(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin.' }, { status: 403 });
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        hospitalId: admin.hospitalId,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(services, { status: 200 });

  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, price } = body; 

    if (!name || typeof name !== 'string' || name.trim() === "") {
      return NextResponse.json({ message: 'Service name is required.' }, { status: 400 });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ message: 'Price must be a positive number.' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name: name.trim(),
        price: price,
        hospitalId: admin.hospitalId,
      }
    });

    return NextResponse.json(newService, { status: 201 });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'A service with this name already exists for your hospital.' }, { status: 409 }); 
    }
    
    console.error("Error creating service:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('id');

  if (!serviceId) {
    return NextResponse.json({ message: 'Service ID is required as a query parameter.' }, { status: 400 });
  }

  try {
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        hospitalId: admin.hospitalId, 
      }
    });

    if (!service) {
      return NextResponse.json({ message: 'Service not found or you do not have permission.' }, { status: 404 });
    }

    const appointmentCount = await prisma.appointment.count({
      where: {
        serviceId: serviceId,
      }
    });

    if (appointmentCount > 0) {
       return NextResponse.json({ message: 'Cannot delete service. It is already linked to existing appointments.' }, { status: 409 }); 
    }

    await prisma.service.delete({
      where: {
        id: serviceId,
      }
    });

    return NextResponse.json({ message: 'Service deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

