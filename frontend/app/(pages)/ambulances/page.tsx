// app/ambulances/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Ambulance = {
  id: string;
  driverName: string;
  licensePlate: string;
  contactNumber: string;
  region: string;
  isAvailable: boolean;
  hospital?: { id: string; name: string | null; city: string | null } | null;
};

export default function AmbulanceDirectoryPage() {
  const [region, setRegion] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Ambulance[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (region.trim()) params.set("region", region.trim());
      if (availableOnly) params.set("available", "true");

      const res = await fetch(`/api/ambulances?${params.toString()}`);
      const data = await res.json();

      // ✅ Ensure we always set an array to avoid .map errors
      if (Array.isArray(data)) {
        setList(data);
      } else if (Array.isArray(data?.ambulances)) {
        // Handle case where API returns { ambulances: [...] }
        setList(data.ambulances);
      } else {
        console.warn("Unexpected API response format:", data);
        setList([]);
      }
    } catch (e) {
      console.error("Failed to fetch ambulances:", e);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
  const waHref = (phone: string) =>
    `https://wa.me/${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-14 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Ambulance Directory
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="border rounded-full px-4 py-2"
              placeholder="Search by region / city"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Show only available
            </label>
            <div className="md:col-span-2 flex gap-2">
              <Button
                onClick={fetchData}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700"
              >
                Search
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setRegion("");
                  setAvailableOnly(true);
                  fetchData();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Conditional Content */}
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : list.length === 0 ? (
          <div className="text-gray-600">
            No ambulances found. Try a different region or remove filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {list.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">
                    {a.driverName}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      a.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Plate:</span>{" "}
                    {a.licensePlate}
                  </div>
                  <div>
                    <span className="font-medium">Region:</span> {a.region}
                  </div>
                  {a.hospital?.name && (
                    <div>
                      <span className="font-medium">Hospital:</span>{" "}
                      {a.hospital.name}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={callHref(a.contactNumber)}
                    className="flex-1 text-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2"
                  >
                    Call {a.contactNumber}
                  </a>
                  <a
                    href={waHref(a.contactNumber)}
                    target="_blank"
                    className="flex-1 text-center rounded-full border px-4 py-2"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
