"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  Menu, X, User, LogOut, Shield, Building2,
  ChevronDown, Bell, Calendar, Phone, Stethoscope, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedLink from "./ProtectedLink";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const adminRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userRole = (session?.user as any)?.role;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">
            Health<span className="text-emerald-600">Care+</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/hospitals-near-me"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-1.5"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
            Hospitals Near Me
          </Link>

          <ProtectedLink
            href="/appointments/hospitals"
            requiredRoles={["PATIENT", "DOCTOR", "HOSPITAL_STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}
            className="ml-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </ProtectedLink>

          {/* Admin dropdown */}
          {session && (userRole === "HOSPITAL_ADMIN" || userRole === "HOSPITAL_STAFF" || userRole === "SUPER_ADMIN") && (
            <div className="relative ml-1" ref={adminRef}>
              <button
                onClick={() => setAdminOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <Shield className="h-4 w-4 text-slate-500" />
                Admin
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {adminOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden py-1"
                  >
                    {(userRole === "HOSPITAL_ADMIN" || userRole === "HOSPITAL_STAFF") && (
                      <ProtectedLink
                        href="/HospitalAdminPanel"
                        requiredRoles={["HOSPITAL_ADMIN", "HOSPITAL_STAFF"]}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-emerald-500" />
                        Hospital Admin
                      </ProtectedLink>
                    )}
                    {userRole === "SUPER_ADMIN" && (
                      <ProtectedLink
                        href="/super-admin/dashboard"
                        requiredRoles={["SUPER_ADMIN"]}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-emerald-500" />
                        Super Admin
                      </ProtectedLink>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* ── Auth ── */}
        <div className="hidden md:flex items-center gap-3">
          {!session ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 font-medium"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 shadow-sm shadow-emerald-200 font-semibold"
                >
                  Sign Up Free
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {session.user?.email?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden py-1"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{session.user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                        {userRole?.replace("_", " ")}
                      </span>
                    </div>
                    {userRole === "DOCTOR" && (
                      <Link
                        href="/doctor/workspace"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Stethoscope className="h-4 w-4 text-emerald-500" />
                        Doctor Workspace
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      My Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-slate-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/hospitals-near-me"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <MapPin className="h-4 w-4" /> Hospitals Near Me
              </Link>

              <ProtectedLink
                href="/appointments/hospitals"
                requiredRoles={["PATIENT", "DOCTOR", "HOSPITAL_STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Calendar className="h-4 w-4" /> Book Appointment
              </ProtectedLink>

              <div className="border-t border-slate-100 pt-3 mt-3">
                {!session ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => { signIn(); setMobileOpen(false); }}
                    >
                      Sign In
                    </Button>
                    <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-4 py-2">
                      <p className="text-sm font-bold text-slate-800">{session.user?.email}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{userRole}</span>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
