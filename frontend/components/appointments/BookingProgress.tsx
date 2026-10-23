"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const STEPS = ["Hospital", "Department", "Time Slot", "Checkout"];

interface BookingProgressProps {
  /** 0 = Hospital, 1 = Department, 2 = Time Slot, 3 = Checkout */
  currentStep: number;
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center py-3 gap-0 overflow-x-auto scrollbar-none">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;

            return (
              <React.Fragment key={step}>
                {/* Step pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                    active
                      ? "bg-emerald-600 text-white"
                      : done
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {/* Circle indicator */}
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                      active
                        ? "border-white/40 text-white bg-white/20"
                        : done
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                        : "border-slate-300 text-slate-400"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : i + 1}
                  </div>
                  {step}
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1 min-w-[20px] transition-all ${
                      i < currentStep ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
