"use client";

import { useState } from "react";
import { AppointmentBooking } from "@/components/appointment-booking";

export default function EmergencyCarePage() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Emergency Care</h1>
      <p className="text-gray-600 mb-6">
        Our 24/7 Emergency Care service ensures immediate medical assistance
        whenever you need it. Our professional team handles emergencies
        efficiently with rapid response and expert care.
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>24/7 emergency response availability</li>
        <li>On-site or remote medical support</li>
        <li>Critical care and stabilization</li>
        <li>Coordination with hospitals and specialists</li>
      </ul>

      <p className="text-lg font-semibold mb-4">Fee: ₹1200 | Available 24/7</p>

      {/* Button now opens booking modal instead of navigating */}
      <button
        onClick={() => setShowBooking(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Book Emergency Support
      </button>

      {/* Show booking modal */}
      {showBooking && (
        <AppointmentBooking onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
