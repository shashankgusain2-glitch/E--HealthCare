"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Loader, PlusCircle, BriefcaseMedical } from "lucide-react";
import { useSession } from "next-auth/react";
import FeedbackAlert from "./FeedbackAlert";

// Type for a hospital service
interface Service {
  id: string;
  name: string;
  price: number;
  createdAt?: string;
}

const API_URL = "/api/admin/services";

// // Utility to format prices in INR
// const formatPrice = (priceInPaise: number) =>
//   (priceInPaise / 100).toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//   });

export default function ServiceManagement() {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch all services
  const fetchServices = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch services");
      setServices(await res.json());
      console.log(services[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Add new service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const priceInPaise = Math.round(Number(newService.price) * 100);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newService.name,
          description: newService.description,
          price: priceInPaise,
          hospitalId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add service");
      const added = await res.json();

      setServices((prev) => [...prev, added]);
      setNewService({ name: "", description: "", price: "" });
      setSuccess(`${added.name} added successfully!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Messages */}
      {success && <FeedbackAlert type="success" message={success} />}
      {error && <FeedbackAlert type="error" message={error} />}

      {/* Add New Service Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <PlusCircle className="h-5 w-5" /> Add New Service
          </CardTitle>
          <CardDescription>Create new medical services with price</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddService} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Service Name</label>
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="MRI Scan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Price (₹)</label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="2000"
                  min="0"
                  required
                />
              </div>
            </div>
             

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" /> Adding Service...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Service
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Service List */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BriefcaseMedical className="h-5 w-5" /> Available Services
          </CardTitle>
          <Badge>{services.length} Services</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">
              <Loader className="animate-spin inline h-6 w-6" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No services added yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-sm transition"
                >
                  <div>
                    <h3 className="font-semibold text-primary text-lg mb-1">
                      {srv.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-700">
                      {srv.price}
                    </span>
                    
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
