"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail, Stethoscope, ArrowRight, Heart } from "lucide-react";

const QUICK_LINKS = [
  { label: "Book Appointment", href: "/appointments/hospitals" },
  { label: "Video Consultation", href: "/consultation" },
  { label: "Find Ambulance", href: "/ambulances" },
  { label: "Register Hospital", href: "/hospital-register" },
  { label: "Contact Us", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

const SOCIAL = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 max-w-7xl py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">Ready to book your appointment?</h3>
            <p className="text-emerald-100">Skip the queue. Choose your hospital and slot in minutes.</p>
          </div>
          <Link
            href="/appointments/hospitals"
            className="flex items-center gap-2 bg-white text-emerald-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg shrink-0"
          >
            Book Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 max-w-7xl pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Health<span className="text-emerald-400">Care+</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Uttarakhand's first unified digital OPD booking platform — connecting patients 
              with verified government hospitals across all major districts.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white font-semibold">Emergency</p>
                  <p className="text-sm text-slate-400">112 (24/7 Helpline)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white font-semibold">Email</p>
                  <p className="text-sm text-slate-400">support@healthcareplus.in</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white font-semibold">Address</p>
                  <p className="text-sm text-slate-400">BTKIT Dwarahat, Almora<br />Uttarakhand – 263653</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HealthCare+. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in Uttarakhand, India
          </p>
        </div>
      </div>
    </footer>
  );
};
