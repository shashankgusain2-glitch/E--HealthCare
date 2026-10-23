import { Heart, Shield, Users, Phone } from "lucide-react"

export const services = [
  {
    title: "General Consultation",
    description: "Health checkups and consultations",
    price: "₹500",
    duration: "30 min",
    icon: Heart,
    href: "/services/general-consultation",
  },
  {
    title: "Specialist Care",
    description: "Expert care from certified specialists",
    price: "₹800",
    duration: "45 min",
    icon: Shield,
    href: "/services/specialist-care",
  },
  {
    title: "Emergency Care",
    description: "24/7 emergency medical services",
    price: "₹1200",
    duration: "Available 24/7",
    icon: Phone,
    href: "/services/emergency-care",
  },
  {
    title: "Health Screening",
    description: "Preventive health screening packages",
    price: "₹1500",
    duration: "60 min",
    icon: Users,
    href: "/services/health-screening",
  },
]


export const doctors = [
    {
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      experience: "15 years",
      rating: 4.9,
      image: "/placeholder-sxl1b.png",
    },
    {
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      experience: "20 years",
      rating: 4.8,
      image: "/placeholder-c1fdl.png",
    },
    {
      name: "Dr. Anita Patel",
      specialty: "Pediatrics",
      experience: "12 years",
      rating: 4.9,
      image: "/placeholder-or8bh.png",
    },
  ]