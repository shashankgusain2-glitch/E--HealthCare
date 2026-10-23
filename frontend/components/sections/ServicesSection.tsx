"use client";

import { motion } from "framer-motion";
import {
  Calendar, Video, Stethoscope, Truck, FileText,
  Pill, ArrowRight, Clock, CheckCircle,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Calendar,
    title: "OPD Appointments",
    description: "Book in-person consultations at verified government hospitals. Choose your department, doctor, and preferred time slot.",
    href: "/appointments/hospitals",
    color: "from-emerald-500 to-teal-500",
    badge: "Most Popular",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["Real-time slot availability", "10+ hospitals", "Instant confirmation"],
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Consult certified doctors via high-quality video calls from home. Powered by ZegoCloud for secure, private sessions.",
    href: "/consultation",
    color: "from-blue-500 to-indigo-500",
    badge: "Available 24/7",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["No travel required", "Secure HD video", "Digital prescription"],
  },
  {
    icon: Truck,
    title: "Ambulance Services",
    description: "Request emergency ambulance services across Uttarakhand with live tracking and instant dispatch for critical situations.",
    href: "/ambulances",
    color: "from-rose-500 to-red-500",
    badge: "Emergency",
    badgeColor: "bg-rose-100 text-rose-700",
    features: ["24/7 emergency response", "Live GPS tracking", "Certified paramedics"],
  },
  {
    icon: FileText,
    title: "Digital Prescriptions",
    description: "Receive auto-generated, doctor-signed prescriptions after every consultation — downloadable as PDFs anytime.",
    href: "#",
    color: "from-amber-500 to-orange-500",
    badge: "Paperless",
    badgeColor: "bg-amber-100 text-amber-700",
    features: ["Doctor authenticated", "PDF download", "Shareable records"],
  },
  {
    icon: Stethoscope,
    title: "Health Records",
    description: "Access your complete medical history, past prescriptions, and diagnostic reports — all in one secure place.",
    href: "#",
    color: "from-violet-500 to-purple-500",
    badge: "Secure",
    badgeColor: "bg-violet-100 text-violet-700",
    features: ["End-to-end encrypted", "Multi-visit history", "Instant access"],
  },
  {
    icon: Pill,
    title: "AI Symptom Checker",
    description: "Use our AI health assistant to get a preliminary symptom analysis, understand your condition, and find the right specialist.",
    href: "https://medical-chatbot4-1.onrender.com/",
    color: "from-cyan-500 to-sky-500",
    badge: "AI Powered",
    badgeColor: "bg-cyan-100 text-cyan-700",
    features: ["Instant analysis", "Doctor suggestions", "Multi-language"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-emerald-200">
            <Clock className="h-4 w-4" />
            Everything you need
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">
            Our Healthcare{" "}
            <span className="text-emerald-600">Services</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From booking appointments to emergency response — we provide end-to-end 
            digital healthcare solutions built for Uttarakhand.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link href={service.href} className="block h-full group">
                <div className="h-full bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
                  {/* Icon + Badge row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                    {service.description}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-1.5 mb-5">
                    {service.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
