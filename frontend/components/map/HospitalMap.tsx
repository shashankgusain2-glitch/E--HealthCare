"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Navigation,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HospitalLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  latitude: number | null;
  longitude: number | null;
  distance?: number | null;
  emergencyServices?: boolean;
  isGovernment?: boolean;
  specialties?: string[];
}

interface HospitalMapProps {
  userLocation: { lat: number; lng: number } | null;
  hospitals: HospitalLocation[];
  selectedHospitalId?: string | null;
  onSelectHospital?: (hospital: HospitalLocation) => void;
  radiusKm?: number;
}

// Controller component to smoothly pan/zoom when selected hospital or user location changes
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Custom modern SVG icons using L.divIcon (avoids broken Leaflet asset paths in Next.js)
const createUserIcon = () =>
  L.divIcon({
    className: "custom-user-pin",
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);"></span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createHospitalIcon = (isSelected: boolean, isEmergency?: boolean) => {
  const bgColor = isSelected
    ? "#059669" // Emerald 600
    : isEmergency
    ? "#dc2626" // Red 600
    : "#0284c7"; // Sky 600

  const borderColor = isSelected ? "#a7f3d0" : "#ffffff";
  const size = isSelected ? 38 : 32;

  return L.divIcon({
    className: "custom-hospital-pin",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2.5px solid ${borderColor};
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
          <svg width="${isSelected ? "18" : "15"}" height="${
      isSelected ? "18" : "15"
    }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 6v12M6 12h12"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export default function HospitalMap({
  userLocation,
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  radiusKm,
}: HospitalMapProps) {
  // Default center: Dehradun, Uttarakhand (Fallback if user location is disabled)
  const defaultCenter: [number, number] = [30.3165, 78.0322];

  // Active center coordinates
  const activeCenter: [number, number] = React.useMemo(() => {
    if (selectedHospitalId) {
      const match = hospitals.find((h) => h.id === selectedHospitalId);
      if (match?.latitude && match?.longitude) {
        return [match.latitude, match.longitude];
      }
    }
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    if (hospitals.length > 0 && hospitals[0].latitude && hospitals[0].longitude) {
      return [hospitals[0].latitude, hospitals[0].longitude];
    }
    return defaultCenter;
  }, [selectedHospitalId, userLocation, hospitals]);

  const activeZoom = selectedHospitalId ? 14 : userLocation ? 12 : 9;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={activeCenter}
        zoom={activeZoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px] z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <MapViewController center={activeCenter} zoom={activeZoom} />

        {/* Free high-quality OpenStreetMap layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Radar / Radius Circle */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="p-1 text-center">
                  <p className="font-semibold text-slate-800 text-sm">
                    Your Current Location
                  </p>
                  <p className="text-xs text-slate-500">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {radiusKm && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000} // convert to meters
                pathOptions={{
                  color: "#3b82f6",
                  fillColor: "#60a5fa",
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: "4 4",
                }}
              />
            )}
          </>
        )}

        {/* Hospital Markers */}
        {hospitals.map((hospital) => {
          if (!hospital.latitude || !hospital.longitude) return null;
          const isSelected = hospital.id === selectedHospitalId;

          return (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              icon={createHospitalIcon(isSelected, hospital.emergencyServices)}
              eventHandlers={{
                click: () => onSelectHospital?.(hospital),
              }}
            >
              <Popup className="hospital-popup">
                <div className="p-2 min-w-[240px] max-w-[280px]">
                  {/* Badge & Distance */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        hospital.name.includes("PHC") || hospital.name.includes("CHC")
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {hospital.name.includes("PHC")
                        ? "Govt PHC"
                        : hospital.name.includes("CHC")
                        ? "Govt CHC"
                        : "Govt Hospital"}
                    </Badge>
                    {hospital.distance !== null &&
                      hospital.distance !== undefined && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-100">
                          {hospital.distance} km away
                        </span>
                      )}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                    {hospital.name}
                  </h4>

                  {/* Address */}
                  <p className="text-xs text-slate-500 flex items-start gap-1 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {hospital.address}, {hospital.city}
                    </span>
                  </p>

                  {/* Emergency Services */}
                  {hospital.emergencyServices && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded mb-2.5">
                      <AlertCircle className="h-3 w-3" />
                      24/7 Emergency Available
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
                    <Link
                      href={`/appointments/hospitals/${hospital.id}/departments`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Book OPD Appointment
                      </Button>
                    </Link>

                    <div className="flex gap-1.5">
                      {hospital.phone && (
                        <a
                          href={`tel:${hospital.phone.replace(/\s+/g, "")}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-7 text-[11px] rounded-lg gap-1 px-2 border-slate-200"
                          >
                            <Phone className="h-3 w-3 text-emerald-600" />
                            Call
                          </Button>
                        </a>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-[11px] rounded-lg gap-1 px-2 border-slate-200"
                        >
                          <Navigation className="h-3 w-3 text-blue-600" />
                          Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
