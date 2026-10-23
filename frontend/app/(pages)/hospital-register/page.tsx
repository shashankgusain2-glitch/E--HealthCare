"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, AlertCircle, CheckCircle, Loader, Heart, FileText, Shield, CalendarDays, Activity, Link2 } from "lucide-react";

interface FormData {
  email: string;
  hospitalName: string;
  address: string;
  phone: string;
  city: string;
  registrationNumber: string;
  stateMedicalCouncil: string;
  establishedYear: string;
  emergencyServices: boolean;
  documentUrl: string;
}

interface SuccessResponse {
  msg: string;
  hospitalId: string;
  details: string;
}

export default function HospitalRegistrationPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    hospitalName: "",
    address: "",
    phone: "",
    city: "",
    registrationNumber: "",
    stateMedicalCouncil: "",
    establishedYear: "",
    emergencyServices: false,
    documentUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session?.user?.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.email || !formData.hospitalName || !formData.address || !formData.city || !formData.registrationNumber || !formData.stateMedicalCouncil || !formData.establishedYear || !formData.documentUrl) {
      setError("Please fill in all required fields (marked with *)");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/hospital/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to submit application");

      setSuccess(true);
      setSuccessData(data);
      setFormData({ email: session?.user?.email || "", hospitalName: "", address: "", phone: "", city: "", registrationNumber: "", stateMedicalCouncil: "", establishedYear: "", emergencyServices: false, documentUrl: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success && successData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">HealthCare+</h1>
            </div>
            <p className="text-muted-foreground">Hospital Registration Portal</p>
          </div>
        </div>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Application Submitted!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Thank you for registering your hospital with HealthCare+
                </p>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Application Details
                  </h3>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <p><span className="font-medium">Hospital ID:</span> {successData.hospitalId}</p>
                    <p className="text-sm">{successData.msg}</p>
                    <p className="text-sm italic mt-4">{successData.details}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    A confirmation email has been sent to your registered email address.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setSuccessData(null);
                    }}
                    className="rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                  >
                    Register Another Hospital
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">HealthCare+</h1>
          </div>
          <p className="text-muted-foreground">Hospital Registration Portal</p>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Hospital Information
              </CardTitle>
              <CardDescription>
                Fill in your hospital details to submit your application for review
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive">Error</h3>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Hospital Name<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    placeholder="Enter hospital name"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Address<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter hospital address"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      City<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Registration Number<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="E.g., REG-2023-XXXX"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      State Medical Council<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="stateMedicalCouncil"
                    value={formData.stateMedicalCouncil}
                    onChange={handleChange}
                    placeholder="E.g., Delhi Medical Council"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Established Year<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    placeholder="YYYY"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    <span className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      Document URL (Licenses)<span className="text-destructive">*</span>
                    </span>
                  </label>
                  <input
                    type="url"
                    name="documentUrl"
                    value={formData.documentUrl}
                    onChange={handleChange}
                    placeholder="Provide a Google Drive/Dropbox valid link"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    name="emergencyServices"
                    id="emergencyServices"
                    checked={formData.emergencyServices}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-primary"
                  />
                  <label htmlFor="emergencyServices" className="text-sm font-semibold text-foreground flex items-center gap-2 cursor-pointer select-none">
                    <Activity className="h-4 w-4 text-primary" />
                    24/7 Emergency Services Available
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold py-6 px-8 rounded-full transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Building2 className="h-5 w-5" />
                      Submit Registration
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
