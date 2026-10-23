"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  Video,
  Download,
  Home,
  ArrowRight,
  Clock,
  Star,
  User,
  Stethoscope,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  startTime: string;
  type: string;
  status: string;
  paymentStatus: string;
  hospital: { name: string; city: string; address: string };
  doctor: { name: string; specialty: string } | null;
  service: { name: string; price: number };
  videoLink: string | null;
}

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/appointments/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load appointment");
        return res.json();
      })
      .then((data) => {
        setAppointment(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-4xl space-y-8">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-12 w-80 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-[3rem]" />
          <Skeleton className="h-80 rounded-[3rem]" />
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Could not load appointment</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Back Home</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(appointment.startTime).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(appointment.startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-14"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-2xl shadow-emerald-200 ring-8 ring-emerald-50"
        >
          <CheckCircle2 className="h-14 w-14" />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight text-primary mb-4">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
          Your appointment has been successfully scheduled and payment received.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-bold text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Appointment ID: #{appointment.id.slice(-8).toUpperCase()}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Details Card */}
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-primary p-8">
            <CardTitle className="text-white text-2xl font-bold flex items-center justify-between">
              Appointment Details
              <Badge className="bg-white/20 text-white border-none rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
                {appointment.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-7">
            <div className="flex gap-5 items-start">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] block mb-0.5">Date & Time</span>
                <p className="text-lg font-black text-primary leading-tight">{formattedDate}</p>
                <p className="text-base font-bold text-muted-foreground">at {formattedTime}</p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Building className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] block mb-0.5">Hospital</span>
                <p className="text-lg font-black text-primary leading-tight">{appointment.hospital.name}</p>
                <p className="text-base font-bold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {appointment.hospital.city}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] block mb-0.5">Department & Doctor</span>
                <p className="text-lg font-black text-primary leading-tight">{appointment.service.name}</p>
                <p className="text-base font-bold text-muted-foreground">
                  {appointment.doctor?.name || "First Available Specialist"}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] block mb-0.5">Payment</span>
                <p className="text-lg font-black text-emerald-600 leading-tight">
                  ₹{(appointment.service.price / 100).toFixed(2)} — {appointment.paymentStatus}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {appointment.type === "VIDEO_CALL" ? "Online Video Consultation" : "In-Person Hospital Visit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="p-8 bg-primary/5 rounded-[3rem] border-2 border-primary/10 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/30">
                {appointment.type === "VIDEO_CALL" ? <Video className="h-6 w-6" /> : <User className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-primary leading-tight">
                  {appointment.type === "VIDEO_CALL" ? "Video Consultation" : "Hospital Visit"}
                </h3>
                <p className="text-muted-foreground font-medium text-sm">
                  {appointment.type === "VIDEO_CALL" ? "Join via link below" : "Visit the hospital"}
                </p>
              </div>
            </div>

            {appointment.type === "VIDEO_CALL" ? (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join the video call 5 minutes before your appointment. The link is unique to your booking.
                </p>
                <Link href={appointment.videoLink || `/consultation?roomID=${appointment.id}`} className="block w-full">
                  <Button className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 group">
                    Join Video Call
                    <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Arrive 15 minutes early. Bring a valid photo ID and this booking confirmation to the reception desk.
                </p>
                <div className="p-4 bg-card rounded-2xl border text-sm space-y-1">
                  <p className="font-bold text-muted-foreground">📍 Address</p>
                  <p className="font-medium">{appointment.hospital.address}, {appointment.hospital.city}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl border-2 hover:bg-muted font-bold text-base"
              onClick={() => window.print()}
            >
              <Download className="h-5 w-5 mr-2" />
              Print
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full h-14 rounded-2xl font-bold text-base">
                Back Home
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            Booked on {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
