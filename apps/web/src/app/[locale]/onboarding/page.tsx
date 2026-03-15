"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

const STEPS = ["Welcome", "Platform Info", "Legal Consent", "Language"];

export default function OnboardingPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/consent", { accepted: true });
      router.push(`/${locale}`);
    } catch {
      router.push(`/${locale}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-brand-500" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          {step === 0 && (
            <div className="text-center">
              <div className="text-5xl mb-4">👋</div>
              <h1 className="text-2xl font-bold text-stone-900 mb-3">Welcome to Seou-up!</h1>
              <p className="text-stone-600 mb-6">
                Let&apos;s set up your account in a few quick steps.
              </p>
              <button onClick={() => setStep(1)} className="w-full bg-brand-500 text-white font-semibold py-3 rounded-xl">
                Get Started
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4">About This Platform</h2>
              <div className="space-y-4 text-sm text-stone-600 mb-6">
                <div className="flex gap-3 p-3 bg-blue-50 rounded-xl">
                  <span>✨</span>
                  <div><strong className="text-stone-900">Brow Simulator</strong> — Visualize styles on your photo before any procedure.</div>
                </div>
                <div className="flex gap-3 p-3 bg-green-50 rounded-xl">
                  <span>🗂️</span>
                  <div><strong className="text-stone-900">Startup Guide</strong> — Resources for microblading entrepreneurs.</div>
                </div>
                <div className="flex gap-3 p-3 bg-amber-50 rounded-xl">
                  <span>⚠️</span>
                  <div><strong className="text-stone-900">Important</strong> — This is a visualization and information tool only. Not a medical or licensed procedure service.</div>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-brand-500 text-white font-semibold py-3 rounded-xl">
                Understood →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4">Legal Consent</h2>
              <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-700 mb-6 max-h-48 overflow-y-auto">
                <p className="font-semibold mb-2">Platform Disclaimer</p>
                <p>
                  Seou-up Microblading is an information and visualization support platform only.
                  We do not provide licensed medical or cosmetic procedure services.
                  All simulations are for illustrative purposes only.
                  Always consult a licensed and certified microblading professional before any procedure.
                </p>
                <br />
                <p className="font-semibold mb-2">Privacy</p>
                <p>
                  Uploaded photos are stored securely and not shared with third parties.
                  Photos are automatically deleted after 30 days.
                </p>
              </div>
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="mt-1 accent-brand-500"
                />
                <span className="text-sm text-stone-700">
                  I understand and agree that Seou-up is a visualization platform only, not a medical or procedure service.
                </span>
              </label>
              <button
                onClick={() => setStep(3)}
                disabled={!consented}
                className="w-full bg-brand-500 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Accept & Continue →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4">Choose Your Language</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { code: "en", label: "English", flag: "🇺🇸" },
                  { code: "ko", label: "한국어", flag: "🇰🇷" },
                  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
                  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {}}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      lang.code === locale
                        ? "border-brand-500 bg-brand-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="font-medium text-stone-900">{lang.label}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-brand-500 text-white font-semibold py-3 rounded-xl"
              >
                {loading ? "Saving..." : "Complete Setup ✓"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
