"use client";

import dynamic from "next/dynamic";
import React from "react";
import { HospitalLocation } from "./HospitalMap";
import { Loader2 } from "lucide-react";

const HospitalMapInternal = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] rounded-3xl bg-slate-100 flex flex-col items-center justify-center gap-3 text-slate-500 border border-slate-200">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="text-sm font-medium">Loading interactive hospital map...</p>
    </div>
  ),
});

interface HospitalMapWrapperProps {
  userLocation: { lat: number; lng: number } | null;
  hospitals: HospitalLocation[];
  selectedHospitalId?: string | null;
  onSelectHospital?: (hospital: HospitalLocation) => void;
  radiusKm?: number;
}

export default function HospitalMapWrapper(props: HospitalMapWrapperProps) {
  return <HospitalMapInternal {...props} />;
}
