"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BookingProgress from "@/components/appointments/BookingProgress";
import {
  ArrowLeft, ChevronRight, Stethoscope, Heart, Brain,
  Bone, Baby, Users, Zap, Shield, Activity, Clock,
  IndianRupee, CheckCircle, ArrowRight,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  price: number;
}

// Maps specialty (extracted from name before " - ") to icon + colors
const DEPT_CONFIG: Record<string, {
  icon: React.ElementType;
  gradient: string;
  light: string;
  badge: string;
  badgeText: string;
}> = {
  "General Medicine": {
    icon: Stethoscope,
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "OPD",
  },
  Cardiology: {
    icon: Heart,
    gradient: "from-rose-500 to-red-600",
    light: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
    badgeText: "Specialist",
  },
  Neurology: {
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    badgeText: "Specialist",
  },
  Orthopedics: {
    icon: Bone,
    gradient: "from-amber-500 to-orange-600",
    light: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    badgeText: "Surgical",
  },
  Pediatrics: {
    icon: Baby,
    gradient: "from-pink-500 to-rose-500",
    light: "bg-pink-50",
    badge: "bg-pink-100 text-pink-700",
    badgeText: "Child Care",
  },
  Gynecology: {
    icon: Users,
    gradient: "from-fuchsia-500 to-pink-600",
    light: "bg-fuchsia-50",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    badgeText: "Women's Health",
  },
  Emergency: {
    icon: Zap,
    gradient: "from-red-500 to-rose-600",
    light: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    badgeText: "24/7",
  },
};

const DEFAULT_CONFIG = {
  icon: Shield,
  gradient: "from-emerald-500 to-teal-600",
  light: "bg-emerald-50",
  badge: "bg-emerald-100 text-emerald-700",
  badgeText: "OPD",
};

function extractSpecialty(name: string): string {
  return name.split(" - ")[0].trim();
}

function getDeptConfig(name: string) {
  const spec = extractSpecialty(name);
  return DEPT_CONFIG[spec] ?? DEFAULT_CONFIG;
}

// Price tier label
function priceTier(price: number): string {
  const rupees = price / 100;
  if (rupees === 0) return "Free";
  if (rupees <= 50) return "Low Cost";
  if (rupees <= 100) return "Moderate";
  return "Specialist";
}

const FEATURES = [
  "OPD slots available",
  "Instant confirmation",
  "Govt. subsidised rates",
];

export default function DepartmentsPage({ params }: { params: { hospitalId: string } }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/hospitals/${params.hospitalId}/departments`)
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.hospitalId]);

  // Group by specialty base name for display
  const grouped = useMemo(() => {
    const map = new Map<string, Department[]>();
    departments.forEach((d) => {
      const spec = extractSpecialty(d.name);
      if (!map.has(spec)) map.set(spec, []);
      map.get(spec)!.push(d);
    });
    return Array.from(map.entries()); // [specialtyName, depts[]]
  }, [departments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <Link href="/appointments/hospitals">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 mb-3 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospitals
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Step 2 of 4 — Select Department
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Choose Your{" "}
                <span className="text-emerald-600">Department</span>
              </h1>
              <p className="text-slate-500 text-base mt-1">
                Select the medical specialty you need a consultation for.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Step Progress Bar ── */}
      <BookingProgress currentStep={1} />

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 max-w-7xl py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-md animate-pulse">
                <div className="h-28 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-10 bg-slate-200 rounded-2xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : grouped.length > 0 ? (
          <>
            <p className="text-slate-500 font-medium mb-6">
              <span className="text-emerald-600 font-bold">{grouped.length}</span> department{grouped.length !== 1 ? "s" : ""} available
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {grouped.map(([specialtyName, depts], index) => {
                const cfg = getDeptConfig(specialtyName);
                const Icon = cfg.icon;
                // Pick the first service's price as representative; show lowest if multiple
                const minPrice = Math.min(...depts.map((d) => d.price));
                // Use the first dept ID for navigation (user picks service on slot page)
                const firstDeptId = depts[0].id;

                return (
                  <motion.div
                    key={specialtyName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                  >
                    <Link href={`/appointments/hospitals/${params.hospitalId}/departments/${firstDeptId}/slots`}>
                      <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer">

                        {/* Colored Header */}
                        <div className={`relative h-28 bg-gradient-to-br ${cfg.gradient} p-5 flex items-end justify-between overflow-hidden`}>
                          {/* Decorative circles */}
                          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10" />
                          <div className="absolute -bottom-4 -right-2 h-16 w-16 rounded-full bg-white/10" />

                          {/* Icon */}
                          <div className="relative p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <Icon className="h-7 w-7 text-white" />
                          </div>

                          {/* Badge */}
                          <div className="relative flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-white text-xs font-bold">{cfg.badgeText}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col flex-1 gap-3">
                          <div>
                            <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                              {specialtyName}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex items-center gap-1 text-emerald-700 font-black text-lg">
                                <IndianRupee className="h-4 w-4" />
                                {(minPrice / 100).toFixed(0)}
                                {depts.length > 1 && <span className="text-sm font-semibold text-slate-400">+</span>}
                              </div>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                                {priceTier(minPrice)}
                              </span>
                            </div>
                          </div>

                          {/* Services list if multiple */}
                          {depts.length > 1 && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Services</p>
                              {depts.slice(0, 3).map((d) => (
                                <div key={d.id} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600 font-medium truncate">
                                    {d.name.split(" - ")[1] ?? d.name}
                                  </span>
                                  <span className="text-emerald-700 font-bold ml-2 shrink-0">₹{(d.price / 100).toFixed(0)}</span>
                                </div>
                              ))}
                              {depts.length > 3 && (
                                <p className="text-xs text-slate-400 font-medium">+{depts.length - 3} more services</p>
                              )}
                            </div>
                          )}

                          {/* Info row */}
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-emerald-500" />
                              9 AM – 5 PM
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-3.5 w-3.5 text-emerald-500" />
                              Slots available
                            </div>
                          </div>

                          {/* CTA */}
                          <Button className="mt-auto w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200 transition-all group/btn">
                            Book This Department
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <Activity className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700">No departments found</h3>
            <p className="text-slate-400 mt-2 mb-6">This hospital hasn't listed any services yet.</p>
            <Link href="/appointments/hospitals">
              <Button variant="outline" className="rounded-2xl px-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hospitals
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
