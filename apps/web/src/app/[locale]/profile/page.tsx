"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  language: string;
  legal_consent_accepted: boolean;
  created_at: string;
}

interface Simulation {
  id: number;
  status: string;
  eyebrow_style_id: number | null;
  created_at: string;
  adapter: string;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  consumer: { label: "Consumer", color: "bg-stone-100 text-stone-600", icon: "👤" },
  pro:      { label: "Pro Artist", color: "bg-brand-100 text-brand-700", icon: "💼" },
  founder:  { label: "Entrepreneur", color: "bg-amber-100 text-amber-700", icon: "🚀" },
  admin:    { label: "Admin", color: "bg-red-100 text-red-700", icon: "🛡️" },
};

const STATUS_COLOR: Record<string, string> = {
  completed:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  failed:     "bg-red-100 text-red-700",
  pending:    "bg-stone-100 text-stone-600",
};

export default function ProfilePage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLang, setSelectedLang] = useState(locale);

  useEffect(() => {
    Promise.all([
      api.get("/api/auth/me"),
      api.get("/api/simulations"),
    ])
      .then(([userRes, simRes]) => {
        setUser(userRes.data);
        setSelectedLang(userRes.data.language);
        setSimulations(Array.isArray(simRes.data) ? simRes.data.slice(0, 5) : []);
      })
      .catch(() => router.push(`/${locale}/auth/login`))
      .finally(() => setLoading(false));
  }, [locale, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/auth/me", { language: selectedLang });
      router.push(`/${selectedLang}/profile`);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push(`/${locale}/auth/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? { label: user.role, color: "bg-stone-100 text-stone-600", icon: "👤" };
  const memberSince = new Date(user.created_at).toLocaleDateString(locale, { year: "numeric", month: "long" });
  const completedSims = simulations.filter(s => s.status === "completed").length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 shadow-sm px-6 py-8">
        <div className="max-w-2xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-3xl font-bold text-brand-600 shrink-0">
            {(user.full_name || user.email)[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-stone-900">{user.full_name || "—"}</h1>
            <p className="text-sm text-stone-500 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${roleConfig.color}`}>
                {roleConfig.icon} {roleConfig.label}
              </span>
              {user.legal_consent_accepted && (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Consent accepted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📅", label: "Member Since", value: memberSince },
            { icon: "✨", label: "Simulations", value: simulations.length.toString() },
            { icon: "✅", label: "Completed", value: completedSims.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-stone-900 leading-none">{stat.value}</div>
              <div className="text-xs text-stone-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Language settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
            🌍 Language Preference
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedLang === lang.code
                    ? "border-brand-500 bg-brand-50"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                <span className="text-sm font-medium text-stone-800">{lang.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || selectedLang === user.language}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving...</>
            ) : selectedLang === user.language ? (
              "Current language selected"
            ) : (
              "Save Language"
            )}
          </button>
        </div>

        {/* Recent simulations */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between">
            <h2 className="font-bold text-stone-900 flex items-center gap-2">✨ Recent Simulations</h2>
            <Link href={`/${locale}/simulate`} className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              New simulation →
            </Link>
          </div>
          {simulations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-stone-400 text-sm">No simulations yet.</p>
              <Link href={`/${locale}/simulate`} className="text-brand-500 text-xs hover:underline mt-2 inline-block">
                Try your first simulation →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {simulations.map((sim) => (
                <div key={sim.id} className="px-6 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-sm">✨</div>
                    <div>
                      <div className="text-sm font-medium text-stone-800">
                        Simulation #{sim.id}
                        {sim.eyebrow_style_id && <span className="text-stone-400 font-normal"> · Style {sim.eyebrow_style_id}</span>}
                      </div>
                      <div className="text-xs text-stone-400">
                        {new Date(sim.created_at).toLocaleDateString()} · {sim.adapter}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[sim.status] ?? "bg-stone-100 text-stone-600"}`}>
                    {sim.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-50">
            <h2 className="font-bold text-stone-900">Quick Links</h2>
          </div>
          <div className="divide-y divide-stone-50">
            {[
              { href: `/${locale}/simulate`,      icon: "✨", label: "Brow Simulator" },
              { href: `/${locale}/guide`,          icon: "🗂️", label: "Startup Guide" },
              { href: `/${locale}/providers`,      icon: "📍", label: "Find Providers" },
              { href: `/${locale}/legal`,          icon: "⚖️", label: "Legal Notices" },
              { href: `/${locale}/feedback`,       icon: "💬", label: "Send Feedback" },
              ...(user.role === "pro" || user.role === "admin" ? [{ href: `/${locale}/pro/dashboard`, icon: "💼", label: "Pro Dashboard" }] : []),
              ...(user.role === "admin" ? [{ href: `/${locale}/admin`, icon: "🛡️", label: "Admin Panel" }] : []),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors"
              >
                <span className="text-sm font-medium text-stone-700">{link.icon} {link.label}</span>
                <span className="text-stone-400 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
