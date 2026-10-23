"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Video, MessageCircle, Ambulance, ArrowRight, ChevronRight, Shield, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProtectedLink from "@/components/ProtectedLink";
import { useSession } from "next-auth/react";



const TRUST_BADGES = [
  { label: "Verified Hospitals", value: "10+" },
  { label: "Specialist Doctors", value: "25+" },
  { label: "Happy Patients", value: "5000+" },
  { label: "Districts Covered", value: "8+" },
];

export default function HeroSection() {
  const { data: session } = useSession();
  const chatUrl = session?.user
    ? `https://medical-chatbot4-2.onrender.com/?email=${encodeURIComponent(session.user.email ?? "")}&name=${encodeURIComponent(session.user.name ?? "")}`
    : "https://medical-chatbot4-2.onrender.com/?logout=true";

    const QUICK_ACTIONS = [
  {
    icon: <Calendar className="h-6 w-6" />,
    label: "Book OPD",
    desc: "Schedule a visit",
    href: "/appointments/hospitals",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    textColor: "text-emerald-700",
    protected: true,
  },
  {
    icon: <Video className="h-6 w-6" />,
    label: "Video Consult",
    desc: "Talk to a doctor",
    href: "/consultation",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    textColor: "text-blue-700",
    protected: false,
  },
  {
    icon: <Ambulance className="h-6 w-6" />,
    label: "Ambulance",
    desc: "Emergency response",
    href: "/ambulances",
    color: "from-rose-500 to-red-500",
    bg: "bg-rose-50",
    textColor: "text-rose-700",
    protected: false,
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    label: "AI Assistant",
    desc: "Symptom checker",
    href: chatUrl,
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    textColor: "text-violet-700",
    protected: false,
  },
];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/30 pt-10 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Uttarakhand's Digital Health Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Quality Care,{" "}
              <span className="relative">
                <span className="text-emerald-600">Zero Queues</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 6 Q150 12 200 6" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-slate-600 text-xl leading-relaxed mb-10 max-w-lg">
              Book OPD appointments at government hospitals across Uttarakhand. 
              Skip the lines — consult verified specialists from the comfort of your home.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <ProtectedLink
                href="/appointments/hospitals"
                requiredRoles={["PATIENT", "DOCTOR", "HOSPITAL_STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}
              >
                <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 transition-all group">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </ProtectedLink>
              <Link href="/hospital-register">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-700 text-base font-bold hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  Register Hospital
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["D", "A", "P", "R"].map((l, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-sm"
                    style={{ background: ["#10b981","#3b82f6","#8b5cf6","#f59e0b"][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-500 font-medium">5000+ patients trust us</p>
              </div>
              <div className="ml-4 flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <Shield className="h-4 w-4 text-emerald-500" />
                Govt. Verified
              </div>
            </div>
          </motion.div>

          {/* ── Right: Quick Action Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {QUICK_ACTIONS.map((action, i) => {
              const card = (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border border-slate-100 cursor-pointer transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">{action.label}</h3>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                  <div className={`mt-4 inline-flex items-center gap-1 text-xs font-bold ${action.textColor}`}>
                    Get Started <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </motion.div>
              );

              return action.protected ? (
                <ProtectedLink
                  key={i}
                  href={action.href}
                  requiredRoles={["PATIENT", "DOCTOR", "HOSPITAL_STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}
                >
                  {card}
                </ProtectedLink>
              ) : (
                <Link key={i} href={action.href}>
                  {card}
                </Link>
              );
            })}

            {/* Stats bar */}
            <div className="col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 grid grid-cols-4 gap-4">
              {TRUST_BADGES.map((b, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-white">{b.value}</p>
                  <p className="text-emerald-200 text-xs font-medium mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}