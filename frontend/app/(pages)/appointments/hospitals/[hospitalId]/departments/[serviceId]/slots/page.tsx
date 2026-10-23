"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon, User, ChevronRight, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SlotGrid from "@/components/appointments/SlotGrid";
import BookingProgress from "@/components/appointments/BookingProgress";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctorId: string | null;
}

export default function SlotsPage({ params }: { params: { hospitalId: string; serviceId: string } }) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/departments/${params.serviceId}/slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
        setAllSlots(data.slots || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch slots", err);
        setLoading(false);
      });
  }, [params.serviceId, selectedDate]);

  const filteredSlots = selectedDoctorId === "all" 
    ? allSlots 
    : allSlots.filter((s) => s.doctorId === selectedDoctorId);

  const handleProceed = () => {
    if (!selectedSlot) return;
    
    const bookingData = {
      hospitalId: params.hospitalId,
      serviceId: params.serviceId,
      doctorId: selectedSlot.doctorId,
      slotId: selectedSlot.id,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      date: selectedDate
    };
    
    localStorage.setItem("pending_appointment", JSON.stringify(bookingData));
    router.push("/appointments/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <Link href={`/appointments/hospitals/${params.hospitalId}/departments`}>
            <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Departments
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Step 3 of 4 — Choose Time Slot
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Pick Your <span className="text-emerald-600">Time Slot</span>
              </h1>
              <p className="text-slate-500 text-base mt-1">Select a convenient time for your appointment.</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
              <CalendarIcon className="h-5 w-5 text-emerald-600 ml-1" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-transparent border-none focus:ring-0 font-bold text-sm outline-none cursor-pointer pr-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <BookingProgress currentStep={2} />

      {/* Main Content */}
      <div className="container mx-auto py-10 px-4 max-w-6xl">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Doctor Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Specialists
            </h2>
            <div className="space-y-2">
              <Button
                variant={selectedDoctorId === "all" ? "default" : "outline"}
                className={`w-full justify-start h-12 rounded-xl border-2 ${selectedDoctorId === "all" ? "shadow-md" : "hover:border-primary/30"}`}
                onClick={() => setSelectedDoctorId("all")}
              >
                All Specialists
              </Button>
              {doctors.map((doc) => (
                <Button
                  key={doc.id}
                  variant={selectedDoctorId === doc.id ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-3 px-4 rounded-xl border-2 text-left flex flex-col items-start gap-0.5 ${selectedDoctorId === doc.id ? "shadow-md" : "hover:border-primary/30"}`}
                  onClick={() => setSelectedDoctorId(doc.id)}
                >
                  <span className="font-bold text-sm leading-tight">{doc.name}</span>
                  <span className="text-[10px] opacity-70 font-medium">{doc.specialty}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-3 items-start">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              If you don't see your preferred specialist, they might not be available on the selected date.
            </p>
          </div>
        </div>

        {/* Main Content: Slot Grid */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block font-medium">Availability for</span>
                  <span className="text-xl font-bold">
                    {new Date(selectedDate).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <div className="space-y-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <Skeleton key={j} className="h-14 rounded-2xl" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SlotGrid
                  slots={filteredSlots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSelectSlot={setSelectedSlot}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Bottom Bar for Proceed */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
          >
            <div className="bg-card/80 backdrop-blur-xl border-2 border-primary/20 shadow-2xl rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex flex-col items-center justify-center text-white shadow-lg shadow-primary/30">
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Slot</span>
                  <span className="text-sm font-bold">
                    {new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-none mb-1">Confirm Selection</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                    <User className="h-3 w-3" />
                    {doctors.find(d => d.id === selectedSlot.doctorId)?.name || "General Specialist"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleProceed} 
                className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group hover:gap-4 transition-all"
              >
                Continue to Payment
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
