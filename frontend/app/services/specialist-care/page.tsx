"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AppointmentBooking } from "@/components/appointment-booking";

export default function SpecialistCarePage() {
  const { data: session } = useSession() as any;
  const [showBooking, setShowBooking] = useState(false);

  const handleBookClick = () => {
    if (!session) {
      toast.error("Please sign in to book an appointment.");
      return;
    }
    setShowBooking(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Specialist Care</h1>
      <p className="text-gray-600 mb-6">
        Our Specialist Care service connects you with certified medical
        professionals across various specialties to diagnose and treat
        specific health concerns effectively.
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>Consultation with certified specialists</li>
        <li>Advanced diagnostic recommendations</li>
        <li>Treatment planning and medication guidance</li>
        <li>Follow-up scheduling and patient counseling</li>
      </ul>

      <p className="text-lg font-semibold mb-4">Fee: ₹800 | Duration: 45 min</p>

      {/* Booking button (same as other pages) */}
      <button
        onClick={handleBookClick}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 border border-green-600"
      >
        Book Appointment
      </button>

      {/* Booking modal */}
      {showBooking && (
        <AppointmentBooking onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
