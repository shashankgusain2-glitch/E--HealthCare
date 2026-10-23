"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Loader, Plus, Stethoscope } from "lucide-react";
import { useSession } from "next-auth/react";
import FeedbackAlert from "./FeedbackAlert";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  createdAt: string;
}

const API_URL = "/api/admin/doctors";

export default function DoctorManagement() {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDoctors = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      setDoctors(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDoctor, hospitalId }),
      });
      if (!res.ok) throw new Error("Error adding doctor");
      const added = await res.json();
      setDoctors((prev) => [...prev, added]);
      setNewDoctor({ name: "", specialty: "" });
      setSuccess(`Dr. ${added.name} added successfully!`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && <FeedbackAlert type="success" message={success} />}
      {error && <FeedbackAlert type="error" message={error} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" /> Register New Doctor
          </CardTitle>
          <CardDescription>Add a doctor to your hospital staff</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDoctor} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                placeholder="Dr. Jane Doe"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                placeholder="Cardiology"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader className="animate-spin h-4 w-4 mr-2" /> Adding...</> : <><Plus className="mr-2 h-4 w-4" /> Add Doctor</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Stethoscope className="h-5 w-5" /> Current Staff
          </CardTitle>
          <Badge>{doctors.length} Doctors</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6"><Loader className="animate-spin inline h-6 w-6" /></div>
          ) : doctors.length === 0 ? (
            <p className="text-center text-muted-foreground">No doctors yet.</p>
          ) : (
            doctors.map((doc) => (
              <div key={doc.id} className="border p-3 rounded-lg flex justify-between">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-primary">{doc.specialty}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Joined {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
