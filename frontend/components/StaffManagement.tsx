"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, UserPlus, Users } from "lucide-react";
import FeedbackAlert from "./FeedbackAlert";

export default function StaffManagement() {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("HOSPITAL_STAFF");
    const [doctorId, setDoctorId] = useState("");
    const [assigning, setAssigning] = useState(false);

    // Fetch staff list & doctors list for linking
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [staffRes, docRes] = await Promise.all([
                fetch("/api/admin/staff"),
                fetch("/api/admin/doctors")
            ]);
            if (staffRes.ok) setStaffList(await staffRes.json());
            if (docRes.ok) setDoctors(await docRes.json());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setAssigning(true);

        try {
            const res = await fetch("/api/admin/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role, doctorId: role === "DOCTOR" ? doctorId : undefined }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to assign role");

            setSuccess(`User ${email} assigned as ${role}`);
            setEmail("");
            setRole("HOSPITAL_STAFF");
            setDoctorId("");
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="space-y-6">
            {success && <FeedbackAlert type="success" message={success} />}
            {error && <FeedbackAlert type="error" message={error} />}

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <UserPlus className="h-5 w-5" /> Add Staff / Doctor Access
                        </CardTitle>
                        <CardDescription>Grant existing users access to hospital tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">User Email</label>
                                <Input
                                    required
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">The user must have already registered an account first.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select value={role} onValueChange={(val) => { setRole(val); setDoctorId(""); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HOSPITAL_STAFF">Hospital Staff (Receptionist)</SelectItem>
                                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {role === "DOCTOR" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link to Doctor Profile</label>
                                    <Select value={doctorId} onValueChange={setDoctorId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select existing doctor profile" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name} ({d.specialty})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={assigning}>
                                {assigning ? <Loader className="animate-spin h-4 w-4 mr-2" /> : null}
                                Grant Access
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Users className="h-5 w-5" /> Current Staff
                        </CardTitle>
                        <CardDescription>Users with Staff/Doctor access</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-6"><Loader className="animate-spin inline h-6 w-6" /></div>
                        ) : staffList.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">No staff members assigned yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {staffList.map((user) => (
                                    <div key={user.id} className="p-3 border rounded-lg bg-slate-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-slate-800">{user.name || "Unknown Name"}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                {user.doctor && (
                                                    <p className="text-xs text-blue-600 mt-1 font-medium">Linked to: {user.doctor.name}</p>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.role === 'DOCTOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
