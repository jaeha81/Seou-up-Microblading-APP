"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

interface AuthUser {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
}

const NAV_LINKS = [
  { key: "simulate", href: "/simulate", label: "Brow Simulator", emoji: "✨" },
  { key: "guide", href: "/guide", label: "Startup Guide", emoji: "🗂️" },
  { key: "providers", href: "/providers", label: "Find Providers", emoji: "📍" },
];

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "en";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = `/${locale}`;
  };

  const isActive = (href: string) =>
    pathname.includes(`/${locale}${href}`);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 shrink-0 group"
        >
          <span className="text-xl">💄</span>
          <span className="font-bold text-stone-900 group-hover:text-brand-500 transition-colors">
            Seou-up
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <span className="text-base leading-none">{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <LanguageSwitcher currentLocale={locale} />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/profile`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                  {(user.full_name || user.email)[0].toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate">
                  {user.full_name || user.email.split("@")[0]}
                </span>
              </Link>
              {user.role === "admin" && (
                <Link
                  href={`/${locale}/admin`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    pathname.includes("/admin")
                      ? "bg-stone-800 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Admin
                </Link>
              )}
              {(user.role === "pro" || user.role === "admin") && (
                <Link
                  href={`/${locale}/pro/dashboard`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    pathname.includes("/pro/")
                      ? "bg-brand-500 text-white"
                      : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                  }`}
                >
                  Pro
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-2 py-1"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 px-4 py-1.5 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="border-t border-stone-100 pt-3 mt-3">
            {user ? (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/profile`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                    {(user.full_name || user.email)[0].toUpperCase()}
                  </div>
                  <span>{user.full_name || user.email.split("@")[0]}</span>
                </Link>
                {(user.role === "pro" || user.role === "admin") && (
                  <Link
                    href={`/${locale}/pro/dashboard`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <span>💼</span>
                    <span>Pro Dashboard</span>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/${locale}/auth/login`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 text-center transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 text-center transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
