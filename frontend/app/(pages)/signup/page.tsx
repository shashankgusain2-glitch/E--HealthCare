"use client";

import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return alert("Please enter your email");

    setLoading(true);
    const res = await fetch(`/api/auth/otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) alert("OTP sent to your email!");
    else alert(data.message || "Something went wrong");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, type: "verification" }),
    });

    const data = await res.json();
    if (res.ok) {
      setVerified(true);
    } else {
      alert(data.message);
    }
  };

  const handleCreateAccount = async () => {
    if (!password) return alert("Enter your password");
    const res = await fetch(`/api/auth/verify-otp`, {
      method: "POST",
      // The backend re-checks the OTP before it will set a password.
      body: JSON.stringify({ email, otp, password, type: "accountCreation" }),
    });

    if (res.ok) {
      alert("Account created successfully!");
      window.location.href = "/login";
    } else {
      alert("Error creating account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-emerald-700 mb-6">
          {verified ? "Set Your Password" : "Create Your Account"}
        </h2>

        {!verified ? (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter OTP"
                className="pl-10"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Verify Email
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Create Password"
              className="border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleCreateAccount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Create Account
            </Button>
          </div>
        )}

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
