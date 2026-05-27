"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const ROLES = [
  {
    value: "consumer",
    label: "Consumer",
    desc: "I want to explore brow styles for myself",
    Icon: UserIcon,
    detail: "Access the brow simulator and find certified providers near you.",
  },
  {
    value: "pro",
    label: "Pro Artist",
    desc: "I'm a licensed microblading professional",
    Icon: BriefcaseIcon,
    detail: "Manage client sessions, run consultations, and track your work.",
  },
  {
    value: "founder",
    label: "Entrepreneur",
    desc: "I want to start a microblading business",
    Icon: ChartIcon,
    detail: "Access startup guides, business resources, and industry insights.",
  },
];

export default function RegisterPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState("consumer");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/register", { ...form, role, language: locale });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(`/${locale}/onboarding`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left: Brand panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-stone-950 text-white p-10">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">S</span>
            <span className="font-bold text-xl group-hover:text-brand-300 transition-colors">Seou-up</span>
          </Link>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold leading-tight mb-4">
            Start your brow journey today
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Join thousands exploring microblading styles and building their beauty businesses.
          </p>
          <div className="space-y-3">
            {ROLES.map((r) => (
              <div key={r.value} className={`p-4 rounded-xl border transition-all ${
                role === r.value
                  ? "border-brand-400 bg-brand-500/20"
                  : "border-stone-700 bg-stone-800/50"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-stone-400"><r.Icon /></span>
                  <span className="font-semibold text-sm">{r.label}</span>
                </div>
                <p className="text-xs text-stone-400">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-stone-600">
          Visualization platform only. Not a licensed medical or procedure provider.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">S</span>
              <span className="font-bold text-xl text-stone-900">Seou-up</span>
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? "bg-green-500 text-white" :
                  step === s ? "bg-brand-500 text-white" :
                  "bg-stone-200 text-stone-400"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? "text-stone-700" : "text-stone-400"}`}>
                  {s === 1 ? "Choose Role" : "Account Details"}
                </span>
                {s < 2 && <div className="w-8 h-px bg-stone-200 mx-1" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900 mb-1">Create Account</h1>
            <p className="text-stone-500 text-sm">
              {step === 1 ? "Tell us who you are to personalize your experience" : `Creating your ${selectedRole.label} account`}
            </p>
          </div>

          {step === 1 ? (
            <div>
              <div className="space-y-3 mb-6">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      role === r.value
                        ? "border-brand-500 bg-brand-50"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 ${role === r.value ? "text-brand-500" : "text-stone-400"}`}><r.Icon /></span>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900 flex items-center gap-2">
                          {r.label}
                          {role === r.value && (
                            <span className="text-brand-500 text-xs">✓ Selected</span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">{r.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Continue as {selectedRole.label} →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-700 flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-colors bg-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-colors bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-colors bg-white"
                    placeholder="Min 8 characters"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1 py-1"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-stone-200 text-stone-600 font-medium py-3 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <Link href={`/${locale}/auth/login`} className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
