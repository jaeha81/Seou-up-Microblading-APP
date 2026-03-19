"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function GoogleCallbackPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received.");
      return;
    }
    api.post("/api/auth/google/callback", { code })
      .then(({ data }) => {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(`/${locale}`);
      })
      .catch(() => {
        setError("Google login failed. Please try again.");
      });
  }, [locale, router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Login Failed</h2>
          <p className="text-sm text-stone-500 mb-6">{error}</p>
          <a href={`/${locale}/auth/login`} className="text-brand-500 font-semibold hover:underline text-sm">
            ← Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500 text-sm">Completing Google sign-in...</p>
      </div>
    </div>
  );
}
