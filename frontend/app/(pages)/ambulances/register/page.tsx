// app/ambulances/register/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AmbulanceRegisterPage() {
  const [form, setForm] = useState({
    driverName: "",
    licensePlate: "",
    contactNumber: "",
    region: "",
    hospitalId: "", // optional
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ambulances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hospitalId: form.hospitalId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register.");
      setMsg({ type: "success", text: "Ambulance registered successfully!" });
      setForm({ driverName: "", licensePlate: "", contactNumber: "", region: "", hospitalId: "" });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-14 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Register Ambulance</h1>
        <p className="text-gray-600 mb-6">
          Register your ambulance so people nearby can contact you directly.
        </p>

        {msg && (
          <div
            className={`mb-4 rounded-lg border p-3 ${
              msg.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Driver Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.driverName}
              onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">License Plate</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.licensePlate}
              onChange={(e) => setForm((f) => ({ ...f, licensePlate: e.target.value }))}
              required
              placeholder="e.g., DL01AB1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.contactNumber}
              onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
              required
              placeholder="+91XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Region / Area</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              required
              placeholder="City or locality e.g., Jaipur / Malviya Nagar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hospital ID (optional)</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.hospitalId}
              onChange={(e) => setForm((f) => ({ ...f, hospitalId: e.target.value }))}
              placeholder="Link to a hospital if applicable"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full h-11 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? "Registering..." : "Register Ambulance"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
}










// virtual assistant in unavailability of doctor for minor health problem
// consultation with video call
// chat/voice assistant (assist patient in traditional uttrakhand ground languages)
// emergency ambulance services in remote hilly locations
// payment gateway for consultations and lab report
// encrypted security
// role based access
// contribute in digital India initiative and Government of India
// saperate model for brain tumour detection