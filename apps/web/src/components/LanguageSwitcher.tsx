"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English",    native: "English",    flag: "🇺🇸" },
  { code: "ko", label: "Korean",     native: "한국어",       flag: "🇰🇷" },
  { code: "zh", label: "Chinese",    native: "中文",         flag: "🇨🇳" },
  { code: "ja", label: "Japanese",   native: "日本語",       flag: "🇯🇵" },
  { code: "th", label: "Thai",       native: "ภาษาไทย",     flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt",  flag: "🇻🇳" },
  { code: "fr", label: "French",     native: "Français",    flag: "🇫🇷" },
  { code: "es", label: "Spanish",    native: "Español",     flag: "🇪🇸" },
  { code: "de", label: "German",     native: "Deutsch",     flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", native: "Português",   flag: "🇧🇷" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", label: "Malay",      native: "Bahasa Melayu",   flag: "🇲🇾" },
  { code: "ru", label: "Russian",    native: "Русский",     flag: "🇷🇺" },
  { code: "ar", label: "Arabic",     native: "العربية",     flag: "🇸🇦" },
  { code: "hi", label: "Hindi",      native: "हिंदी",        flag: "🇮🇳" },
  { code: "tr", label: "Turkish",    native: "Türkçe",      flag: "🇹🇷" },
  { code: "it", label: "Italian",    native: "Italiano",    flag: "🇮🇹" },
  { code: "tl", label: "Filipino",   native: "Filipino",    flag: "🇵🇭" },
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  // pointerdown handles both mouse and touch on mobile
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const handleSwitch = (code: string) => {
    setOpen(false);
    const segments = pathname.split("/");
    // segments[0] = "", segments[1] = locale
    if (segments.length < 2) {
      window.location.href = `/${code}`;
      return;
    }
    segments[1] = code;
    window.location.href = segments.join("/") || `/${code}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200 touch-manipulation"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-semibold tracking-wide uppercase">{current.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Invisible full-screen backdrop for easy close on mobile */}
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <div
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 overflow-hidden"
            style={{ maxHeight: "min(288px, calc(100dvh - 80px))" }}
          >
            <div className="px-3 py-2 border-b border-stone-50">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Select Language
              </p>
            </div>
            <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: "min(240px, calc(100dvh - 130px))" }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={lang.code === currentLocale}
                  onPointerDown={(e) => {
                    // Prevent the document pointerdown handler from closing dropdown
                    e.stopPropagation();
                  }}
                  onClick={() => handleSwitch(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors touch-manipulation ${
                    lang.code === currentLocale
                      ? "bg-brand-50 text-brand-700"
                      : "text-stone-700 hover:bg-stone-50 active:bg-stone-100"
                  }`}
                >
                  <span className="text-lg leading-none w-6 text-center">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{lang.native}</p>
                    <p className="text-xs text-stone-400 leading-tight">{lang.label}</p>
                  </div>
                  {lang.code === currentLocale && (
                    <svg
                      className="w-4 h-4 text-brand-500 shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
