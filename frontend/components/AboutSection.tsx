"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Globe, Clock, Award, Users } from "lucide-react";

const stats = [
  { value: "10+", label: "Hospitals", icon: <ShieldCheck className="h-5 w-5" /> },
  { value: "25+", label: "Specialists", icon: <Stethoscope className="h-5 w-5" /> },
  { value: "5K+", label: "Patients Served", icon: <Users className="h-5 w-5" /> },
  { value: "8+", label: "Districts", icon: <Globe className="h-5 w-5" /> },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Fully Verified & Secure",
    description:
      "Every hospital on our platform is government-approved and verified. Your personal health data is protected with enterprise-grade encryption.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Clock,
    title: "Book in Under 2 Minutes",
    description:
      "Our streamlined 4-step booking flow lets you choose a hospital, department, doctor, and time slot — and confirm your appointment instantly.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Award,
    title: "Expert Specialists",
    description:
      "Connect with qualified doctors across Cardiology, Neurology, Orthopedics, Gynecology, and more — all at government rates.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Globe,
    title: "Accessible Everywhere",
    description:
      "Whether you're in Dehradun, Haldwani, or a remote district — our platform covers healthcare across all of Uttarakhand.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-3">
                {s.icon}
              </div>
              <p className="text-4xl font-black text-slate-900 mb-1">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Award className="h-4 w-4" />
              Why HealthCare+ is Different
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
              Built for Real{" "}
              <span className="text-emerald-600">Uttarakhand</span>{" "}
              Healthcare
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              We've partnered with government hospitals across all major districts 
              to bring a unified, digital healthcare experience — eliminating paperwork, 
              long queues, and uncertainty from patient care.
            </p>
            <div className="space-y-4">
              {["No registration fees — free to use for all patients", "Real-time slot booking with zero overbooking", "Razorpay-secured payments for consultation charges", "Confirmation SMS & email for every booking"].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((f, index) => (
              <div
                key={index}
                className={`p-6 rounded-3xl border ${f.border} ${f.bg} hover:shadow-md transition-shadow`}
              >
                <div className={`h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${f.color} mb-4`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
