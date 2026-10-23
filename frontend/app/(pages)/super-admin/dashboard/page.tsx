"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader,
  Truck,
  FileText,
  Shield,
  Activity,
  Link2,
} from "lucide-react";

type Hospital = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  applicantEmail?: string;
  registrationNumber: string;
  stateMedicalCouncil: string;
  establishedYear: number;
  emergencyServices: boolean;
  documentUrl: string;
  createdAt: string;
};

type Ambulance = {
  id: string;
  driverName: string;
  licensePlate: string;
  contactNumber: string;
  region: string;
  createdAt: string;
};

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"hospitals" | "ambulances">("hospitals");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🏥 Fetch Hospitals
  const fetchHospitals = async () => {
    try {
      const res = await fetch("/api/super-admin");
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      const data = await res.json();
      setHospitals(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🚑 Fetch Ambulances
  const fetchAmbulances = async () => {
    try {
      const res = await fetch("/api/super-admin/ambulances");
      if (!res.ok) throw new Error("Failed to fetch ambulances");
      const data = await res.json();
      setAmbulances(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🧭 Load both
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchHospitals(), fetchAmbulances()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🧾 Handle Actions (Hospitals)
  const handleHospitalAction = async (
    hospitalId: string,
    applicantEmail: string | null | undefined,
    action: "APPROVE" | "REJECT"
  ) => {
    if (!applicantEmail && action === "APPROVE") {
      setError("Cannot approve: Applicant email is missing.");
      return;
    }
    setActionLoading(hospitalId);
    try {
      const res = await fetch("/api/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          adminEmail: applicantEmail,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to process request");

      setSuccess(data.msg);
      setHospitals((prev) => prev.filter((h) => h.id !== hospitalId));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // 🚦 Handle Actions (Ambulances)
  const handleAmbulanceAction = async (ambulanceId: string, action: "APPROVE" | "REJECT") => {
    setActionLoading(ambulanceId);
    try {
      const res = await fetch("/api/super-admin/ambulances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambulanceId, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to process request");

      setSuccess(data.msg);
      setAmbulances((prev) => prev.filter((a) => a.id !== ambulanceId));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Review hospitals and ambulance registrations</p>

          {/* Tabs */}
          <div className="mt-6 flex gap-3">
            <Button
              variant={activeTab === "hospitals" ? "default" : "outline"}
              onClick={() => setActiveTab("hospitals")}
            >
              Hospitals
            </Button>
            <Button
              variant={activeTab === "ambulances" ? "default" : "outline"}
              onClick={() => setActiveTab("ambulances")}
            >
              Ambulances
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-600">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-600">Success</h3>
                <p className="text-sm">{success}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading pending items...</p>
        </div>
      )}

      {/* 🏥 Hospitals Tab */}
      {!loading && activeTab === "hospitals" && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            {hospitals.length === 0 ? (
              <Card className="border-0 shadow-sm text-center py-16">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Hospitals</h3>
                  <p className="text-muted-foreground">All hospital applications are reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {hospitals.map((h) => (
                  <Card key={h.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Building2 className="h-6 w-6 text-primary" /> {h.name}
                      </CardTitle>
                      <CardDescription>Hospital Registration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p>{h.address}</p>
                            <p>{h.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p>{h.phone || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Applicant Email</p>
                            <p>{h.applicantEmail || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                            <p>{new Date(h.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <FileText className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Registration No.</p>
                            <p className="font-semibold">{h.registrationNumber}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Shield className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Council & Year</p>
                            <p>{h.stateMedicalCouncil} (Est. {h.establishedYear})</p>
                          </div>
                        </div>
                        <div className="flex gap-3 md:col-span-2 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-900">
                          <Activity className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Emergency Services</p>
                            <p className="text-emerald-900 dark:text-emerald-300 font-semibold">{h.emergencyServices ? "Available 24/7" : "Not Currently Available"}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 md:col-span-2 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-2">
                          <Link2 className="h-5 w-5 text-blue-600" />
                          <div className="w-full overflow-hidden">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Verification Documents</p>
                            <a href={h.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all font-medium inline-block mt-1">
                              View Attached Documents ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() =>
                            handleHospitalAction(h.id, h.applicantEmail, "APPROVE")
                          }
                          disabled={!h.applicantEmail || actionLoading === h.id}
                        >
                          {actionLoading === h.id ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleHospitalAction(h.id, h.applicantEmail, "REJECT")}
                          disabled={actionLoading === h.id}
                        >
                          {actionLoading === h.id ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 🚑 Ambulances Tab */}
      {!loading && activeTab === "ambulances" && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            {ambulances.length === 0 ? (
              <Card className="border-0 shadow-sm text-center py-16">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Ambulances</h3>
                  <p className="text-muted-foreground">All ambulance registrations are reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {ambulances.map((a) => (
                  <Card key={a.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Truck className="h-6 w-6 text-primary" /> {a.driverName}
                      </CardTitle>
                      <CardDescription>Ambulance Registration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Contact</p>
                            <p>{a.contactNumber}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Region</p>
                            <p>{a.region}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Registered</p>
                            <p>{new Date(a.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAmbulanceAction(a.id, "APPROVE")}
                          disabled={actionLoading === a.id}
                        >
                          {actionLoading === a.id ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAmbulanceAction(a.id, "REJECT")}
                          disabled={actionLoading === a.id}
                        >
                          {actionLoading === a.id ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
