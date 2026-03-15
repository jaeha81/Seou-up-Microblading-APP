"use client";

import { useRouter, usePathname } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "ko", label: "KO", flag: "🇰🇷" },
  { code: "th", label: "TH", flag: "🇹🇭" },
  { code: "vi", label: "VI", flag: "🇻🇳" },
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (locale: string) => {
    // Replace the current locale segment in the URL
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSwitch(lang.code)}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            currentLocale === lang.code
              ? "bg-brand-500 text-white"
              : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          }`}
          title={lang.flag}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
