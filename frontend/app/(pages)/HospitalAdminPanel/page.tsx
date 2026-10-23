"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Clock, IndianRupee, Stethoscope, TrendingUp, User } from "lucide-react";
import DoctorManagement from "@/components/DoctorManagement";
import TimeSlotManagement from "@/components/TimeSlotManagement";
import AppointmentManagement from "@/components/AppointmentManagement";
import ServiceManagement from "@/components/ServiceManagement";
import StaffManagement from "@/components/StaffManagement";

const allTabs = [
  { id: "staff", label: "Staff Management", icon: User, component: StaffManagement, roles: ["HOSPITAL_ADMIN"] },
  { id: "appointments", label: "Appointments", icon: Calendar, component: AppointmentManagement, roles: ["HOSPITAL_ADMIN", "HOSPITAL_STAFF"] },
  { id: "doctors", label: "Doctors", icon: Stethoscope, component: DoctorManagement, roles: ["HOSPITAL_ADMIN"] },
  { id: "slots", label: "Time Slots", icon: Clock, component: TimeSlotManagement, roles: ["HOSPITAL_ADMIN", "HOSPITAL_STAFF"] },
  { id: "services", label: "Services & Pricing", icon: IndianRupee, component: ServiceManagement, roles: ["HOSPITAL_ADMIN"] },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession() as any;
  const userRole = session?.user?.role;

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => tab.roles.includes(userRole));

  // Default to first available tab
  const defaultTab = tabs.length > 0 ? tabs[0].id : "";
  const [activeTab, setActiveTab] = useState("");

  // Set default tab when tabs load or role changes
  if (activeTab === "" && defaultTab !== "") {
    setActiveTab(defaultTab);
  }

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const Component = activeTabData?.component;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
          <p className="text-sm text-slate-500 mt-1">Healthcare Management</p>
        </div>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                  ? "bg-green-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Quick Stats</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">Overview</p>
          <p className="text-sm text-slate-600">Manage your hospital data</p>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {Component ? <Component /> : <p>Select a tab to manage</p>}
      </main>
    </div>
  );
}
