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

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export default function ProfilePage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLang, setSelectedLang] = useState(locale);

  useEffect(() => {
    api.get("/api/auth/me")
      .then(({ data }) => {
        setUser(data);
        setSelectedLang(data.language);
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-2xl font-bold text-brand-600">
              {(user.full_name || user.email)[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-stone-900">{user.full_name || "—"}</div>
              <div className="text-sm text-stone-500">{user.email}</div>
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                {user.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">Language</label>
            <div className="grid grid-cols-2 gap-2">
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
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-3">
          <Link href={`/${locale}/simulate`} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors">
            <span className="text-sm font-medium text-stone-700">✨ Brow Simulator</span>
            <span className="text-stone-400">→</span>
          </Link>
          <Link href={`/${locale}/legal`} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors">
            <span className="text-sm font-medium text-stone-700">⚖️ Legal Notices</span>
            <span className="text-stone-400">→</span>
          </Link>
          <Link href={`/${locale}/feedback`} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors">
            <span className="text-sm font-medium text-stone-700">💬 Send Feedback</span>
            <span className="text-stone-400">→</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors"
          >
            <span className="text-sm font-medium text-red-600">🚪 Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
