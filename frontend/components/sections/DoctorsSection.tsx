"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

// Temporary static doctor data (we can later fetch dynamically)
const doctors = [
  {
    name: "Dr. Aditi Sharma",
    specialty: "Cardiologist",
    image: "/doctors/doctor1.jpg", 
    availability: "Mon - Fri, 9AM - 5PM",
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Orthopedic Surgeon",
    image: "/doctors/doctor2.jpg",
    availability: "Mon - Sat, 10AM - 6PM",
  },
  {
    name: "Dr. Neha Singh",
    specialty: "Pediatrician",
    image: "/doctors/doctor3.jpg",
    availability: "Tue - Sun, 8AM - 2PM",
  },
  {
    name: "Dr. Rohan Verma",
    specialty: "Dermatologist",
    image: "/doctors/doctor4.jpg",
    availability: "Mon - Fri, 11AM - 4PM",
  },
];

export default function DoctorsSection() {
  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-6"
        >
          Meet Our <span className="text-emerald-600">Doctors</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Our team of experienced medical professionals is here to provide compassionate care 
          and expert treatment for you and your loved ones.
        </motion.p>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-emerald-50 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="relative w-full h-60">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-emerald-700 font-medium mb-3">
                  {doctor.specialty}
                </p>
                <div className="flex justify-center items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {doctor.availability}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
