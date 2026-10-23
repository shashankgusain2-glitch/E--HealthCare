"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import BookingProgress from "@/components/appointments/BookingProgress";
import {
  ArrowLeft,
  CreditCard,
  Video,
  User,
  Building,
  Clock,
  ShieldCheck,
  Loader2,
  Stethoscope,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ServiceDetails {
  id: string;
  name: string;
  price: number;
}

interface BookingData {
  hospitalId: string;
  serviceId: string;
  doctorId: string | null;
  slotId: string;
  startTime: string;
  endTime: string;
  date: string;
  doctorName?: string;
  hospitalName?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [appointmentType, setAppointmentType] = useState<"IN_PERSON" | "VIDEO_CALL">("IN_PERSON");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("pending_appointment");
    if (!savedData) {
      router.push("/appointments/hospitals");
      return;
    }
    const parsed = JSON.parse(savedData) as BookingData;
    setBookingData(parsed);

    // Fetch service details to get real price
    fetch(`/api/hospitals/${parsed.hospitalId}/departments`)
      .then((res) => res.json())
      .then((services: ServiceDetails[]) => {
        const found = services.find((s) => s.id === parsed.serviceId);
        if (found) setService(found);
      })
      .finally(() => setLoadingPage(false));
  }, [router]);

  const handlePayment = async () => {
    if (!session?.user) {
      toast.error("Please login to continue");
      return;
    }
    if (!bookingData || !service) return;

    try {
      setProcessing(true);
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: bookingData.hospitalId,
          serviceId: bookingData.serviceId,
          doctorId: bookingData.doctorId,
          timeSlotId: bookingData.slotId,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          type: appointmentType,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      const { appointment, razorpayOrder } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "HealthCare Platform",
        description: `${service.name} Consultation`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            setProcessing(true);
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment.id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            localStorage.removeItem("pending_appointment");
            router.push(`/appointments/confirmation/${appointment.id}`);
          } catch (err: any) {
            toast.error(err.message);
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        prefill: {
          name: session.user.name ?? "",
          email: session.user.email ?? "",
        },
        theme: { color: "#3B82F6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message);
      setProcessing(false);
    }
  };

  if (loadingPage || !bookingData) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-40 rounded-3xl" />
          </div>
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  const formattedDate = new Date(bookingData.date).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(bookingData.startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 mb-3 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Slots
          </Button>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Step 4 of 4 — Confirm & Pay
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Finalize <span className="text-emerald-600">Booking</span>
          </h1>
          <p className="text-slate-500 text-base mt-1">
            Review your appointment details and complete payment securely.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <BookingProgress currentStep={3} />

      {/* Main Content */}
      <div className="container mx-auto py-10 px-4 max-w-5xl">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Type */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">1</span>
              Appointment Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["IN_PERSON", "VIDEO_CALL"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${
                    appointmentType === type
                      ? "bg-primary/5 border-primary shadow-lg ring-4 ring-primary/5"
                      : "bg-card border-muted hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl transition-all ${
                      appointmentType === type ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {type === "IN_PERSON" ? <User className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {type === "IN_PERSON" ? "In-Person Visit" : "Video Consultation"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type === "IN_PERSON"
                        ? "Visit the hospital for a physical consultation."
                        : "Consult online via video call from home."}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Notes */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">2</span>
              Notes <span className="text-sm text-muted-foreground font-normal">(optional)</span>
            </h2>
            <Textarea
              placeholder="Describe your symptoms or concerns briefly..."
              className="min-h-[130px] rounded-[2rem] p-6 border-2 focus:border-primary transition-all resize-none text-base"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>

        {/* Right: Order Summary */}
        <div>
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-10">
            <CardHeader className="bg-primary text-white px-8 py-7">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                Order Summary
                <Badge className="bg-white/20 text-white border-none rounded-full px-3 py-1 text-xs font-black">
                  Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-7 space-y-6">
              <div className="space-y-5">
                <div className="flex gap-4 items-center">
                  <div className="p-2.5 bg-muted rounded-xl shrink-0">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block">Department</span>
                    <p className="font-bold text-sm truncate">{service?.name ?? "—"}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-2.5 bg-muted rounded-xl shrink-0">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block">Date & Time</span>
                    <p className="font-bold text-sm">{formattedDate}</p>
                    <p className="text-xs text-muted-foreground font-medium">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="p-2.5 bg-muted rounded-xl shrink-0">
                    {appointmentType === "IN_PERSON" ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Video className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block">Type</span>
                    <p className="font-bold text-sm">
                      {appointmentType === "IN_PERSON" ? "In-Person Visit" : "Video Consultation"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-muted" />

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Amount</p>
                  <p className="text-4xl font-black text-primary tracking-tight">
                    ₹{service ? (service.price / 100).toFixed(0) : "—"}
                  </p>
                </div>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 rounded-lg px-3 py-1">
                  Secure
                </Badge>
              </div>

              <div className="flex items-start gap-2 p-3.5 bg-blue-50 text-blue-700 rounded-2xl text-xs font-medium border border-blue-100">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                Payments secured by Razorpay. Your card details are never stored.
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <Button
                onClick={handlePayment}
                disabled={processing || !service}
                className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-6 w-6 mr-3" />
                    Pay ₹{service ? (service.price / 100).toFixed(0) : ""}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
