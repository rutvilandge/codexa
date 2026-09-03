import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import AuthBackground from "@/components/auth/AuthBackground";
import AuthCard from "@/components/auth/AuthCard";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthShowcase from "@/components/auth/AuthShowcase";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialLogin from "@/components/auth/SocialLogin";
import { registerUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/types/auth";

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = (await registerUser({ name, email, password })) as AuthResponse;
      setUser(result.user);
      setToken(result.token);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message ?? "Unable to create your account" : "Unable to create your account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070B]">
      <AuthBackground />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        <AuthShowcase />
        <div className="flex items-center justify-center px-6 py-12">
          <AuthCard title="Create Account" subtitle="Create your account and start building with AI.">
            <SocialLogin />
            <AuthDivider />
            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <div><label className="mb-2 block text-sm text-zinc-300">Full Name</label><input type="text" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required placeholder="Enter your full name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500" /></div>
              <div><label className="mb-2 block text-sm text-zinc-300">Email</label><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500" /></div>
              <div><label className="mb-2 block text-sm text-zinc-300">Password</label><PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} name="password" autoComplete="new-password" required /></div>
              <div><label className="mb-2 block text-sm text-zinc-300">Confirm Password</label><PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} name="confirmPassword" autoComplete="new-password" required placeholder="Confirm Password" /></div>
              {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
              <button disabled={isSubmitting} className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Creating account..." : "Create Account"}</button>
            </form>
            <p className="mt-8 text-center text-zinc-400">Already have an account? <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">Sign In</Link></p>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
