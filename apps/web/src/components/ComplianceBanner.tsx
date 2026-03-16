"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SUPPORTED_LOCALES = ["en", "ko", "th", "vi"];

export default function ComplianceBanner() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  if (dismissed) return null;

  const segments = pathname.split("/");
  const locale = SUPPORTED_LOCALES.includes(segments[1]) ? segments[1] : "en";

  return (
    <div className="compliance-banner flex items-center justify-between gap-4 px-4 py-2 bg-stone-900 text-stone-300 text-xs">
      <p className="flex-1 text-center">
        ⚠️ <strong className="text-white">Seou-up</strong> is an information and visualization support
        platform only. Not a licensed medical or procedure provider.{" "}
        <Link href={`/${locale}/legal`} className="underline hover:text-white transition-colors">
          Learn more
        </Link>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-stone-500 hover:text-white transition-colors text-sm leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
