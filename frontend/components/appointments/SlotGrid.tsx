"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctorId: string | null;
}

interface SlotGridProps {
  slots: Slot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: Slot) => void;
}

export default function SlotGrid({ slots, selectedSlotId, onSelectSlot }: SlotGridProps) {
  const formatTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const morningSlots = slots.filter((s) => new Date(s.startTime).getUTCHours() < 12);
  const afternoonSlots = slots.filter(
    (s) => new Date(s.startTime).getUTCHours() >= 12 && new Date(s.startTime).getUTCHours() < 17
  );
  const eveningSlots = slots.filter((s) => new Date(s.startTime).getUTCHours() >= 17);

  const renderSlotSection = (title: string, sectionSlots: Slot[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-muted-foreground border-b pb-2">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {sectionSlots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isPast = new Date(slot.startTime) < new Date();
          const isAvailable = !slot.isBooked && !isPast;

          return (
            <motion.button
              key={slot.id}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              disabled={!isAvailable}
              onClick={() => onSelectSlot(slot)}
              className={`
                relative h-14 rounded-2xl text-sm font-bold transition-all border-2
                ${isSelected 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg ring-4 ring-primary/20" 
                  : isAvailable 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-100" 
                    : slot.isBooked 
                      ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed opacity-60" 
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-40"}
              `}
            >
              {formatTime(slot.startTime)}
              {slot.isBooked && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                  Full
                </span>
              )}
            </motion.button>
          );
        })}
        {sectionSlots.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground italic py-4">No slots available for this period.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Available
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full border border-red-200">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Not Available
        </div>
      </div>

      <div className="space-y-12">
        {renderSlotSection("Morning (Before 12 PM)", morningSlots)}
        {renderSlotSection("Afternoon (12 PM - 5 PM)", afternoonSlots)}
        {renderSlotSection("Evening (After 5 PM)", eveningSlots)}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground font-medium">No slots found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}
