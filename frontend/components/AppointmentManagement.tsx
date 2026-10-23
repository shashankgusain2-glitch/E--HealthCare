"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader, CalendarCheck, Video, User, Stethoscope, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeedbackAlert from "./FeedbackAlert";

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  videoLink?: string;
  patient: { name: string; email: string };
  doctor: { name: string; specialty: string } | null;
  service: { name: string; price: number };
}

const API_URL = "/api/admin/appointments";

// Format price in INR
const formatPrice = (priceInPaise: number) =>
  (priceInPaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

// Format readable date/time
const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AppointmentManagement() {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      setAppointments(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update appointment status
  const handleStatusChange = async (id: string, status: string) => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id, status }),
      });

      if (!res.ok) throw new Error("Failed to update appointment");

      const updated = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setSuccess(`Appointment updated to ${status}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {success && <FeedbackAlert type="success" message={success} />}
      {error && <FeedbackAlert type="error" message={error} />}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CalendarCheck className="h-5 w-5" /> Appointments
          </CardTitle>
          <CardDescription>Manage and update hospital appointments</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-6">
              <Loader className="animate-spin inline h-6 w-6" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No appointments found.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{a.patient.name}</span>
                      <Badge variant="secondary">{a.status}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        <Stethoscope className="inline h-4 w-4 mr-1" />{" "}
                        {a.doctor ? `${a.doctor.name} (${a.doctor.specialty})` : "General / Unassigned"}
                      </p>
                      <p>
                        <IndianRupee className="inline h-4 w-4 mr-1" />{" "}
                        {a.service.name} – {formatPrice(a.service.price)}
                      </p>
                      <p>
                        🕒 {a.type === "VIDEO_CALL"
                          ? `${formatDateTime(a.startTime)} → ${formatDateTime(a.endTime)}`
                          : `${new Date(a.startTime).toLocaleDateString("en-IN", { dateStyle: "medium" })} (Day Appointment)`}
                      </p>
                      <p>Type: {a.type}</p>
                      {a.videoLink && (
                        <a
                          href={a.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm flex items-center gap-1 mt-1"
                        >
                          <Video className="h-4 w-4" /> Join Call
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status Control */}
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <Select
                      onValueChange={(val) => handleStatusChange(a.id, val)}
                      defaultValue={a.status}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELED">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
