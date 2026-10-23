"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HospitalMapWrapper from "@/components/map/HospitalMapWrapper";
import { HospitalLocation } from "@/components/map/HospitalMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Crosshair,
  Navigation,
  Phone,
  Calendar,
  AlertCircle,
  Building2,
  CheckCircle2,
  Filter,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const RADIUS_OPTIONS = [
  { label: "Any Distance", value: 0 },
  { label: "Within 10 km", value: 10 },
  { label: "Within 25 km", value: 25 },
  { label: "Within 50 km", value: 50 },
  { label: "Within 100 km", value: 100 },
];

export default function NearbyHospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRadius, setSelectedRadius] = useState<number>(0);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null
  );
  const [locationStatus, setLocationStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");

  // Fetch hospitals from API
  const fetchHospitals = async (lat?: number, lng?: number, radius?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        params.set("lat", lat.toString());
        params.set("lng", lng.toString());
      }
      if (radius && radius > 0) {
        params.set("radius", radius.toString());
      }
      params.set("governmentOnly", "true");

      const res = await fetch(`/api/hospitals/nearby?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.hospitals)) {
        setHospitals(data.hospitals);
      } else {
        setHospitals([]);
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
      toast.error("Could not load hospital locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Detect user's current GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus("granted");
        setDetectingLocation(false);
        toast.success("Location detected! Sorted hospitals by distance.");
        fetchHospitals(coords.lat, coords.lng, selectedRadius);
      },
      (error) => {
        setDetectingLocation(false);
        setLocationStatus("denied");
        console.warn("Geolocation denied or error:", error);
        toast.warning(
          "Location access was denied. Showing all Uttarakhand government hospitals."
        );
        fetchHospitals(undefined, undefined, selectedRadius);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Initial load: check permission status or attempt detection
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              setLocationStatus("granted");
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  };
                  setUserLocation(coords);
                  fetchHospitals(coords.lat, coords.lng, selectedRadius);
                },
                () => {
                  fetchHospitals(undefined, undefined, selectedRadius);
                },
                { enableHighAccuracy: true, timeout: 8000 }
              );
            } else if (permissionStatus.state === "prompt") {
              // Ask for location permission
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  };
                  setUserLocation(coords);
                  setLocationStatus("granted");
                  fetchHospitals(coords.lat, coords.lng, selectedRadius);
                },
                () => {
                  setLocationStatus("prompt");
                  fetchHospitals(undefined, undefined, selectedRadius);
                },
                { enableHighAccuracy: true, timeout: 8000 }
              );
            } else {
              setLocationStatus("denied");
              fetchHospitals(undefined, undefined, selectedRadius);
            }

            permissionStatus.onchange = () => {
              if (permissionStatus.state === "granted") {
                handleDetectLocation();
              }
            };
          })
          .catch(() => {
            fetchHospitals(undefined, undefined, selectedRadius);
          });
      } else {
        handleDetectLocation();
      }
    } else {
      fetchHospitals(undefined, undefined, selectedRadius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When radius changes
  const handleRadiusChange = (radius: number) => {
    setSelectedRadius(radius);
    if (userLocation) {
      fetchHospitals(userLocation.lat, userLocation.lng, radius);
    }
  };

  // Filter hospitals based on search query
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      );
    });
  }, [hospitals, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* ── Banner Header ── */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Verified Uttarakhand Government Hospitals
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Government Hospitals Near You
              </h1>
              <p className="text-emerald-100 mt-2 text-sm md:text-base max-w-2xl">
                Explore nearby verified government hospitals on an interactive map.
                Find emergency facilities, get instant driving directions, or book
                your OPD appointment directly.
              </p>
            </div>

            {/* Geolocation Controls & Quick Town Selectors */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl shadow-lg gap-2 h-10 px-4 text-xs md:text-sm"
                >
                  {detectingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                  ) : (
                    <Crosshair className="h-4 w-4 text-emerald-700" />
                  )}
                  {userLocation ? "Detect GPS Again" : "Detect My Location"}
                </Button>

                <Button
                  onClick={() => {
                    const dwarahatCoords = { lat: 29.7820, lng: 79.4310 };
                    setUserLocation(dwarahatCoords);
                    setLocationStatus("granted");
                    toast.success("Location set to Dwarahat, Almora!");
                    fetchHospitals(dwarahatCoords.lat, dwarahatCoords.lng, selectedRadius);
                  }}
                  variant="outline"
                  className="bg-emerald-900/60 hover:bg-emerald-900 text-white border-emerald-400/30 rounded-xl h-10 px-3.5 text-xs font-semibold gap-1.5"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                  Set to Dwarahat
                </Button>
              </div>

              {/* Quick Preset Selector */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-200">
                <span className="text-[11px] text-emerald-300/80">Quick Switch:</span>
                {[
                  { name: "Dwarahat", lat: 29.7820, lng: 79.4310 },
                  { name: "Almora", lat: 29.6050, lng: 79.6600 },
                  { name: "Ranikhet", lat: 29.6430, lng: 79.4320 },
                  { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
                  { name: "Haldwani", lat: 29.2183, lng: 79.5130 },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      const coords = { lat: preset.lat, lng: preset.lng };
                      setUserLocation(coords);
                      setLocationStatus("granted");
                      toast.success(`Location set to ${preset.name}`);
                      fetchHospitals(coords.lat, coords.lng, selectedRadius);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-all border border-white/10"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name or district..."
              className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-sm focus:bg-white"
            />
          </div>

          {/* Radius Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Radius:
            </span>
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleRadiusChange(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap border ${
                  selectedRadius === opt.value
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout: Hospitals List + Map ── */}
      <main className="container mx-auto max-w-7xl p-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left: Hospital Cards (5 Cols on large screens) */}
          <div className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                {filteredHospitals.length}{" "}
                {filteredHospitals.length === 1 ? "Hospital" : "Hospitals"} Found
              </h2>
              {userLocation && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sorted by distance
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm">Finding nearby government hospitals...</p>
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-700">No hospitals match</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Try expanding the distance radius or changing your search terms.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRadius(0);
                    if (userLocation) {
                      fetchHospitals(userLocation.lat, userLocation.lng, 0);
                    } else {
                      fetchHospitals();
                    }
                  }}
                  className="rounded-xl text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {filteredHospitals.map((hospital) => {
                  const isSelected = hospital.id === selectedHospitalId;

                  return (
                    <motion.div
                      key={hospital.id}
                      layout
                      onClick={() => setSelectedHospitalId(hospital.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all bg-white hover:shadow-md ${
                        isSelected
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                          : "border-slate-200/80 hover:border-emerald-300"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold ${
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
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              {hospital.distance} km away
                            </span>
                          )}
                      </div>

                      {/* Hospital Name */}
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {hospital.name}
                      </h3>

                      {/* Address */}
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {hospital.address}, {hospital.city}
                        </span>
                      </p>

                      {/* Emergency Notice */}
                      {hospital.emergencyServices && (
                        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          <AlertCircle className="h-3 w-3" />
                          24/7 Emergency Care
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link
                          href={`/appointments/hospitals/${hospital.id}/departments`}
                          className="flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 font-semibold"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            Book OPD
                          </Button>
                        </Link>

                        {hospital.phone && (
                          <a
                            href={`tel:${hospital.phone.replace(/\s+/g, "")}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs rounded-lg px-2.5 border-slate-200"
                            >
                              <Phone className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                          </a>
                        )}

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs rounded-lg px-2.5 border-slate-200"
                          >
                            <Navigation className="h-3.5 w-3.5 text-blue-600" />
                          </Button>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Map Container (7 Cols on large screens) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="lg:sticky lg:top-36 h-[460px] lg:h-[calc(100vh-170px)] min-h-[460px]">
              <HospitalMapWrapper
                userLocation={userLocation}
                hospitals={filteredHospitals}
                selectedHospitalId={selectedHospitalId}
                onSelectHospital={(h) => setSelectedHospitalId(h.id)}
                radiusKm={selectedRadius > 0 ? selectedRadius : undefined}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
