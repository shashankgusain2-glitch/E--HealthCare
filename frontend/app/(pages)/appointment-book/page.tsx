"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Stethoscope,
  DollarSign,
  User,
  Clock,
  Building,
  CreditCard,
  Video,
  Info,
  PartyPopper,
} from "lucide-react";

// --------------------------------------------------------------------
// STAND-IN HOOKS (Replace with real imports in production)
// --------------------------------------------------------------------
const useSession = () => ({
  data: {
    user: {
      id: "mock-patient-id-123",
      name: "Mock Patient",
      email: "patient@example.com",
      phone: "9876543210",
    },
  },
  status: "authenticated",
});

const Script = (props: any) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${props.src}"]`)) return;
    const script = document.createElement("script");
    script.src = props.src;
    script.async = true;
    document.body.appendChild(script);
  }, [props.src]);
  return null;
};

// --------------------------------------------------------------------
// TYPES
// --------------------------------------------------------------------
interface Hospital {
  id: string;
  name: string;
  city: string;
}
interface Service {
  id: string;
  name: string;
  price: number;
}
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  createdAt: string;
}
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  doctorId: string | null;
  doctor: { name: string } | null;
}
interface Appointment {
  id: string;
  razorpayOrderId: string;
}
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

// --------------------------------------------------------------------
// API URLs
// --------------------------------------------------------------------
const PUBLIC_API_URL = "/api/public/data";
const INITIATE_PAYMENT_URL = "/api/payment/initiate";
const VERIFY_PAYMENT_URL = "/api/payment/verify";

// --------------------------------------------------------------------
// Notification Component
// --------------------------------------------------------------------
interface NotificationBoxProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}
const NotificationBox: React.FC<NotificationBoxProps> = ({
  type,
  title,
  message,
}) => {
  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
        ? AlertCircle
        : Info;
  const colorClasses =
    type === "success"
      ? "bg-green-100 border-green-200 text-green-700"
      : type === "error"
        ? "bg-red-100 border-red-200 text-red-700"
        : "bg-blue-100 border-blue-200 text-blue-700";
  const iconColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
        ? "text-red-600"
        : "text-blue-600";

  return (
    <div
      className={`p-4 rounded-lg border flex gap-3 shadow-md ${colorClasses}`}
    >
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------
const formatPrice = (price: number) =>
  (price / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" });

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const generateReceipt = (data: any) => {
  const { hospital, doctor, service, date, time } = data;
  const receiptHtml = `
    <html>
      <head>
        <title>Appointment Receipt</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .label { font-weight: bold; color: #666; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>HealthCare+</h1>
          <p>Appointment Receipt</p>
        </div>
        <div class="detail-row"><span class="label">Hospital:</span><span>${hospital?.name}</span></div>
        <div class="detail-row"><span class="label">Doctor:</span><span>${doctor?.name || "General"}</span></div>
        <div class="detail-row"><span class="label">Service:</span><span>${service?.name}</span></div>
        <div class="detail-row"><span class="label">Date:</span><span>${date}</span></div>
        <div class="detail-row"><span class="label">Time:</span><span>${time}</span></div>
        <div class="detail-row"><span class="label">Amount Paid:</span><span style="font-weight: bold;">₹${(service?.price / 100).toFixed(2)}</span></div>
        <div class="footer">
          <p>Thank you for using HealthCare+. Please present this receipt at the hospital counter.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        <button onclick="window.print()" class="no-print" style="margin-top: 30px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Print / Save as PDF</button>
      </body>
    </html>
  `;
  const win = window.open("", "_blank");
  win?.document.write(receiptHtml);
  win?.document.close();
};

// --------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------
export default function PatientBookingForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [appointmentType, setAppointmentType] = useState<
    "IN_PERSON" | "VIDEO_CALL"
  >("IN_PERSON");
  const [notes, setNotes] = useState("");
  const [confirmedAppointmentId, setConfirmedAppointmentId] = useState<string | null>(null);

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // --------------------------------------------------------------------
  // Fetch Hospitals, Services, Doctors, and Slots
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${PUBLIC_API_URL}?type=hospitals`);
        if (!res.ok) throw new Error("Failed to fetch hospitals.");
        setHospitals(await res.json());
      } catch (err: any) {
        setError(err.message);
        setHospitals([{ id: "hosp-1", name: "Demo Hospital", city: "DemoCity" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${PUBLIC_API_URL}?type=services&hospitalId=${selectedHospital.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch services.");
        setServices(await res.json());
      } catch (err: any) {
        setError(err.message);
        setServices([{ id: "serv-1", name: "Demo Consultation", price: 50000 }]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedHospital]);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${PUBLIC_API_URL}?type=doctors&hospitalId=${selectedHospital.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch doctors.");
        setDoctors(await res.json());
      } catch (err: any) {
        setError(err.message);
        setDoctors([
          {
            id: "doc-1",
            name: "Dr. Demo",
            specialty: "General",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [selectedHospital]);

  useEffect(() => {
    if (!selectedHospital || !selectedDoctor) return;
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const doctorQuery =
          !selectedDoctor || selectedDoctor.id === "video-doc"
            ? "&doctorId=general"
            : `&doctorId=${selectedDoctor.id}`;
        const url = `${PUBLIC_API_URL}?type=slots&hospitalId=${selectedHospital.id}&date=${selectedDate}${doctorQuery}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch slots.");
        const data = await res.json();
        setTimeSlots(data);
      } catch (err: any) {
        setError(err.message);
        setTimeSlots([
          {
            id: "slot-1",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            doctorId: "doc-1",
            doctor: { name: "Dr. Demo" },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedHospital, selectedDoctor, selectedDate, appointmentType]);

  // --------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------
  const nextStep = () => {
    if (step === 2 && appointmentType === "IN_PERSON") {
      setStep(4); // Skip slot selection for in-person
    } else {
      setStep((s) => s + 1);
    }
  };
  const prevStep = () => {
    if (step === 4 && appointmentType === "IN_PERSON") {
      setStep(2);
    } else {
      setStep((s) => s - 1);
    }
  };

  // --------------------------------------------------------------------
  // Payment
  // --------------------------------------------------------------------
  const handlePayment = async () => {
    if (!razorpayKeyId) {
      setError("Payment gateway not configured.");
      return;
    }
    if (
      !session?.user ||
      !selectedHospital ||
      !selectedDoctor ||
      !selectedService ||
      (appointmentType === "VIDEO_CALL" && !selectedTimeSlot)
    ) {
      setError("Missing booking details.");
      return;
    }

    const startTime = appointmentType === "VIDEO_CALL"
      ? selectedTimeSlot?.startTime
      : new Date(selectedDate + "T09:00:00").toISOString();
    const endTime = appointmentType === "VIDEO_CALL"
      ? selectedTimeSlot?.endTime
      : new Date(selectedDate + "T17:00:00").toISOString();

    try {
      setLoading(true);
      const res = await fetch(INITIATE_PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          doctorId: selectedDoctor.id === "video-doc" ? null : selectedDoctor.id,
          serviceId: selectedService.id,
          timeSlotId: selectedTimeSlot?.id || null,
          startTime,
          endTime,
          type: appointmentType,
          notes,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment init failed.");

      const { appointment, razorpayOrder }: { appointment: Appointment; razorpayOrder: RazorpayOrder } = data;

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "HealthCare+ Appointment",
        description: `Booking for ${selectedService.name}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment.id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            setConfirmedAppointmentId(appointment.id);
            setStep(5);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: (session.user as any)?.phone || "",
        },
        theme: { color: "#3B82F6" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------
  // Render Steps
  // --------------------------------------------------------------------
  const renderStep = () => {
    if (loading && step < 4)
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      );

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 1: Select Appointment Type & Hospital
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={
                  appointmentType === "IN_PERSON" ? "default" : "outline"
                }
                onClick={() => setAppointmentType("IN_PERSON")}
              >
                <User className="h-4 w-4 mr-2" /> In-Person
              </Button>
              <Button
                variant={
                  appointmentType === "VIDEO_CALL" ? "default" : "outline"
                }
                onClick={() => setAppointmentType("VIDEO_CALL")}
              >
                <Video className="h-4 w-4 mr-2" /> Video Call
              </Button>
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Available Hospitals</label>
              {hospitals.map((h) => (
                <Button
                  key={h.id}
                  variant={
                    selectedHospital?.id === h.id ? "secondary" : "outline"
                  }
                  className="w-full justify-between"
                  onClick={() => setSelectedHospital(h)}
                >
                  <span>{h.name}</span>
                  <Building className="h-5 w-5 text-primary" />
                </Button>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!selectedHospital}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 2: Select Service & Doctor
            </h2>
            <div className="space-y-2">
              <label className="font-semibold">Services</label>
              {services.map((s) => (
                <Button
                  key={s.id}
                  variant={
                    selectedService?.id === s.id ? "secondary" : "outline"
                  }
                  onClick={() => setSelectedService(s)}
                  className="w-full justify-between"
                >
                  <span>{s.name}</span>
                  <span className="text-primary">{formatPrice(s.price)}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-4">
              <label className="font-semibold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" /> Select Doctor
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* General Option */}
                <Button
                  variant={selectedDoctor?.id === "video-doc" || selectedDoctor?.id === "general" ? "secondary" : "outline"}
                  onClick={() =>
                    setSelectedDoctor({
                      id: "video-doc",
                      name: "General Consultation",
                      specialty: "Online/Walk-in",
                      createdAt: new Date().toISOString(),
                    })
                  }
                  className="h-auto py-3 px-4 justify-start text-left flex flex-col items-start gap-1"
                >
                  <div className="font-bold flex items-center gap-2 w-full">
                    <Video className="h-4 w-4 text-primary" /> General
                  </div>
                  <span className="text-xs opacity-70 italic">No specific doctor</span>
                </Button>

                {/* Doctor List */}
                {doctors.map((d) => (
                  <Button
                    key={d.id}
                    variant={selectedDoctor?.id === d.id ? "secondary" : "outline"}
                    onClick={() => setSelectedDoctor(d)}
                    className="h-auto py-3 px-4 justify-start text-left flex flex-col items-start gap-1"
                  >
                    <div className="font-bold">{d.name}</div>
                    <span className="text-xs opacity-70">{d.specialty}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!selectedService || !selectedDoctor}
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 3: Select Date & Time Slot
            </h2>

            <div>
              <label className="font-semibold">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full mt-2 p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold">
                Available Slots for {formatDate(selectedDate)}
              </label>
              <p className="text-sm text-muted-foreground">
                Doctor: {selectedDoctor?.name}
              </p>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-xs mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-primary" /> Selected
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm border border-input" /> Available
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted opacity-50" /> Booked
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => {
                      const isBooked = (slot as any).isBooked;
                      return (
                        <Button
                          key={slot.id}
                          disabled={isBooked}
                          variant={
                            selectedTimeSlot?.id === slot.id ? "default" : isBooked ? "outline" : "outline"
                          }
                          className={`h-12 text-xs font-medium rounded-xl transition-all relative ${isBooked
                            ? "bg-muted text-muted-foreground border-muted opacity-60 cursor-not-allowed overflow-hidden"
                            : selectedTimeSlot?.id === slot.id
                              ? "ring-2 ring-primary ring-offset-2"
                              : "hover:border-primary hover:text-primary hover:bg-primary/5"
                            }`}
                          onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                        >
                          {formatTime(slot.startTime)}
                          {isBooked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rotate-12">
                              <span className="text-[8px] font-bold uppercase tracking-tighter text-red-600/50">Booked</span>
                            </div>
                          )}
                        </Button>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center border-2 border-dashed rounded-2xl bg-muted/30">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground">No slots available for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full border rounded-md p-2 min-h-[80px]"
            />

            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={nextStep} disabled={!selectedTimeSlot}>
                Review & Pay <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 4: Review & Pay</h2>
            <div className="p-4 border rounded-md bg-muted/50 space-y-3">
              <div className="flex justify-between">
                <span>Hospital:</span>
                <span>{selectedHospital?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span>{selectedDoctor?.id === 'video-doc' ? "General (Video)" : selectedDoctor?.name || "General"}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              {appointmentType === "VIDEO_CALL" && (
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formatTime(selectedTimeSlot?.startTime || "")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-primary">
                  {formatPrice(selectedService?.price || 0)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handlePayment} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />{" "}
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div >
        );

      case 5:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <PartyPopper className="h-12 w-12 text-green-600" />
            <h2 className="text-2xl font-bold">Appointment Confirmed!</h2>
            <p>
              You’ll receive an email confirmation shortly from{" "}
              {selectedHospital?.name}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-primary text-primary hover:bg-primary/5"
                onClick={() => generateReceipt({
                  hospital: selectedHospital,
                  doctor: selectedDoctor?.id === 'video-doc' ? null : selectedDoctor,
                  service: selectedService,
                  date: formatDate(selectedDate),
                  time: appointmentType === "VIDEO_CALL" ? formatTime(selectedTimeSlot?.startTime || "") : "Managed by Hospital",
                })}
              >
                Download Receipt
              </Button>
              {appointmentType === "VIDEO_CALL" ? (
                <Button
                  className="flex-1 rounded-full group"
                  onClick={() => window.open(`/consultation/${confirmedAppointmentId}`, "_blank")}
                >
                  <Video className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                  Join Call
                </Button>
              ) : (
                <Button className="flex-1 rounded-full" onClick={() => window.location.reload()}>
                  Book Another
                </Button>
              )}
            </div>
            {appointmentType === "VIDEO_CALL" && (
              <p className="text-xs text-muted-foreground mt-2">
                The join link has also been sent to your email.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Step {step} of 5{" "}
            {step === 1
              ? "(Select Hospital)"
              : step === 2
                ? "(Select Doctor)"
                : step === 3
                  ? "(Select Slot)"
                  : step === 4
                    ? "(Review & Pay)"
                    : "(Success)"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  );
}
