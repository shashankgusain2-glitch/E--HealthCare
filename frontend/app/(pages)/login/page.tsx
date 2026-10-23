"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Where to go after signing in: the protected page that sent the user here
// (?callbackUrl=..., same-site paths only, so it can't redirect to another site), else home.
function getCallbackUrl() {
  const target = new URLSearchParams(window.location.search).get("callbackUrl");
  return target && /^\/(?![\/\\])/.test(target) ? target : "/";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes("OTP sent")) {
        alert("OTP sent! Please verify your email.");
        window.location.href = "/signup";
      } else {
        alert(result.error);
      }
    } else {
      window.location.href = getCallbackUrl();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-center text-emerald-700 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Logging In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-gray-600 my-4">or</div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: getCallbackUrl() })}
            className="w-full flex items-center justify-center gap-2 border-gray-300"
          >
            <img src="/google-icon.png" className="h-5 w-5" alt="Google" />
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: getCallbackUrl() })}
            className="w-full flex items-center justify-center gap-2 border-gray-300"
          >
            <img src="/githubicon.png" className="h-5 w-5" alt="GitHub" />
            Sign in with GitHub
          </Button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          New here?{" "}
          <a href="/signup" className="text-emerald-600 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
