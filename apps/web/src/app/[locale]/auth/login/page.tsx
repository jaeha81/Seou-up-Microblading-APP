"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(`/${locale}`);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left: Brand panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-gradient-to-br from-stone-900 to-stone-800 text-white p-10">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-2xl">💄</span>
            <span className="font-bold text-xl group-hover:text-brand-300 transition-colors">Seou-up</span>
          </Link>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold leading-tight mb-4">
            Welcome back to your brow journey
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Sign in to access your simulations, saved styles, and consultation history.
          </p>
          <div className="space-y-3">
            {[
              { icon: "✨", text: "12 eyebrow styles to explore" },
              { icon: "🔒", text: "Photos private & auto-deleted after 30 days" },
              { icon: "🌍", text: "Available in EN · KO · TH · VI" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-stone-400">
                <span>{item.icon}</span>
                <span>{item.text}</span>
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
              <span className="text-2xl">💄</span>
              <span className="font-bold text-xl text-stone-900">Seou-up</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-1">Sign In</h1>
            <p className="text-stone-500 text-sm">Welcome back to Seou-up Microblading</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-700 mb-5 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-colors bg-white"
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-all mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-400">or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { data } = await api.get("/api/auth/google");
                    window.location.href = data.auth_url;
                  } catch { /* noop */ }
                }}
                className="flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { data } = await api.get("/api/auth/kakao");
                    window.location.href = data.auth_url;
                  } catch { /* noop */ }
                }}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                <span className="text-base">💬</span>
                Kakao
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link href={`/${locale}/auth/register`} className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <p className="text-xs text-stone-400 text-center mt-8 px-4 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href={`/${locale}/legal`} className="hover:text-brand-500 transition-colors underline">
              Terms of Service
            </Link>
            . Seou-up is for visualization purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
