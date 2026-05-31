"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

interface AuthUser {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
}

export default function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("nav");

  const NAV_LINKS = [
    { key: "simulate", href: "/simulate", label: t("simulate"), highlight: false },
    { key: "features", href: "/features", label: t("features"), highlight: false },
    { key: "providers", href: "/providers", label: t("providers"), highlight: false },
    { key: "pricing", href: "/pricing", label: t("pricing"), highlight: true },
  ];

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
          <span className="font-bold text-stone-900 group-hover:text-brand-500 transition-colors tracking-tight">
            Seou<span className="text-brand-500">-up</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            link.highlight ? (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                  isActive(link.href)
                    ? "bg-brand-500 text-white border-brand-500"
                    : "text-brand-600 border-brand-200 hover:bg-brand-50 hover:border-brand-300"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-600"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            )
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
              <Link
                href={`/${locale}/clinic`}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  pathname.includes("/clinic")
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                Clinic
              </Link>
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
                {t("sign_out")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 px-4 py-1.5 rounded-lg transition-colors"
              >
                {t("get_started")}
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
                link.highlight
                  ? isActive(link.href)
                    ? "bg-brand-500 text-white"
                    : "text-brand-600 bg-brand-50 hover:bg-brand-100"
                  : isActive(link.href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
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
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    <span>Pro Dashboard</span>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                  <span>{t("sign_out")}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/${locale}/auth/login`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 text-center transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 text-center transition-colors"
                >
                  {t("get_started")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
