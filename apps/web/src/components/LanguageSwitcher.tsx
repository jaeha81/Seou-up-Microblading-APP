"use client";

import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = (code: string) => {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
        aria-label="Select language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-semibold tracking-wide uppercase">{current.code}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-stone-50">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Select Language</p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSwitch(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  lang.code === currentLocale
                    ? "bg-brand-50 text-brand-700"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span className="text-lg leading-none w-6 text-center">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{lang.native}</p>
                  <p className="text-xs text-stone-400 leading-tight">{lang.label}</p>
                </div>
                {lang.code === currentLocale && (
                  <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
