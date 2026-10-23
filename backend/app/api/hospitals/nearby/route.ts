import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HospitalStatus } from "@prisma/client";

// Haversine formula to calculate great-circle distance between two points in km
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place (e.g. 5.4 km)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const radiusParam = searchParams.get("radius"); // radius in km (optional)
    const governmentOnly = searchParams.get("governmentOnly") !== "false"; // default true

    const userLat = latParam ? parseFloat(latParam) : null;
    const userLng = lngParam ? parseFloat(lngParam) : null;
    const maxRadius = radiusParam ? parseFloat(radiusParam) : null;

    // Filter criteria
    const whereClause: any = {
      status: HospitalStatus.APPROVED,
    };

    if (governmentOnly) {
      whereClause.isGovernment = true;
    }

    // Fetch approved hospitals
    const hospitals = await prisma.hospital.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        phone: true,
        emergencyServices: true,
        isGovernment: true,
        latitude: true,
        longitude: true,
        services: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map and enrich with distance if user coordinates provided
    let results = hospitals.map((hospital) => {
      let distance: number | null = null;
      if (
        userLat !== null &&
        userLng !== null &&
        hospital.latitude !== null &&
        hospital.longitude !== null
      ) {
        distance = calculateDistanceKm(
          userLat,
          userLng,
          hospital.latitude,
          hospital.longitude
        );
      }

      // Collect unique specialty titles
      const specialties = Array.from(
        new Set(
          hospital.services.map((s) => s.name.split(" - ")[0].trim())
        )
      );

      return {
        ...hospital,
        distance, // in km
        specialties,
      };
    });

    // If user provided coordinates, filter by radius (if requested) and sort by distance
    if (userLat !== null && userLng !== null) {
      if (maxRadius !== null && !isNaN(maxRadius) && maxRadius > 0) {
        results = results.filter(
          (h) => h.distance !== null && h.distance <= maxRadius
        );
      }

      // Sort nearest first
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return NextResponse.json({
      success: true,
      userLocation:
        userLat !== null && userLng !== null
          ? { lat: userLat, lng: userLng }
          : null,
      count: results.length,
      hospitals: results,
    });
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
