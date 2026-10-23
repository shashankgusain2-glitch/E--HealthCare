"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Mail, HeartPulse, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTACTS = [
  {
    icon: Phone,
    title: "Emergency Helpline",
    info: "+91 112",
    sub: "24/7 Emergency Response",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: Mail,
    title: "Support Email",
    info: "support@healthcareplus.in",
    sub: "We reply within 24 hours",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    info: "BTKIT Campus, Dwarahat",
    sub: "Almora, Uttarakhand – 263653",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-50 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-emerald-200">
            <MessageCircle className="h-4 w-4" />
            We're here to help
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5">
            Get In{" "}
            <span className="text-emerald-600">Touch</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Have questions about appointments, hospital listings, or need technical support? 
            Our team is always ready to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact cards + Operating hours */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {CONTACTS.map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-5 p-5 rounded-2xl border ${c.border} ${c.bg} hover:shadow-sm transition-shadow`}
              >
                <div className={`h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${c.color} shrink-0`}>
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">{c.title}</p>
                  <p className="text-base font-black text-slate-800">{c.info}</p>
                  <p className="text-sm text-slate-500">{c.sub}</p>
                </div>
              </div>
            ))}

            {/* Operating Hours */}
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Operating Hours</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", time: "9:00 AM – 2:00 PM" },
                  { day: "Sunday", time: "Closed (Emergency: 112)" },
                ].map((h, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{h.day}</span>
                    <span className={`text-sm font-semibold ${h.time.includes("Closed") ? "text-rose-400" : "text-emerald-400"}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
              <h3 className="text-2xl font-black text-slate-800 mb-1">Send us a Message</h3>
              <p className="text-slate-500 text-sm mb-7">Fill the form and we'll get back to you shortly.</p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder="Ramesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder="ramesh@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                    placeholder="Appointment issue / Hospital inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm transition-all resize-none bg-slate-50 focus:bg-white"
                    placeholder="Describe your query in detail..."
                  />
                </div>

                <Button className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
