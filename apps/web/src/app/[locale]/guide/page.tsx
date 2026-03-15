import { use } from "react";
import Link from "next/link";

interface GuideArticle {
  id: number;
  slug: string;
  title_en: string;
  title_ko: string | null;
  body_en: string | null;
  category: string | null;
}

async function getGuides(): Promise<GuideArticle[]> {
  try {
    const res = await fetch("http://localhost:8000/api/guides", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// Fallback data for when API is not running
const FALLBACK_GUIDES: GuideArticle[] = [
  { id: 1, slug: "microblading-business-basics", title_en: "Starting Your Microblading Business: The Complete Guide", title_ko: "마이크로블레이딩 창업 완전 가이드", body_en: null, category: "startup" },
  { id: 2, slug: "equipment-and-tools", title_en: "Essential Equipment & Tools for Microblading Professionals", title_ko: "마이크로블레이딩 전문가를 위한 필수 장비 및 도구", body_en: null, category: "technique" },
  { id: 3, slug: "client-consultation-guide", title_en: "How to Conduct a Perfect Client Consultation", title_ko: "완벽한 고객 상담 방법", body_en: null, category: "technique" },
  { id: 4, slug: "marketing-your-microblading-business", title_en: "Marketing Your Microblading Business in the Digital Age", title_ko: "디지털 시대의 마이크로블레이딩 비즈니스 마케팅", body_en: null, category: "marketing" },
  { id: 5, slug: "aftercare-and-healing", title_en: "Aftercare & Healing: What Clients Need to Know", title_ko: "사후 관리 및 치유: 고객이 알아야 할 것", body_en: null, category: "technique" },
];

const CATEGORY_ICONS: Record<string, string> = {
  startup: "🚀",
  technique: "🎨",
  marketing: "📣",
};

export default async function GuidePage({ params }: { params: { locale: string } }) {
  const guides = await getGuides();
  const displayGuides = guides.length > 0 ? guides : FALLBACK_GUIDES;
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Startup Guide</h1>
        <p className="text-stone-600 mb-8">
          Everything you need to launch and grow your microblading business.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Educational Content Only</strong> — All guides are for informational purposes.
          Always verify local licensing and health regulations in your jurisdiction.
        </div>

        <div className="space-y-4">
          {displayGuides.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{CATEGORY_ICONS[article.category ?? ""] ?? "📄"}</span>
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="font-semibold text-stone-900 text-lg mb-1">
                    {locale === "ko" && article.title_ko ? article.title_ko : article.title_en}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/guide/${article.slug}`}
                  className="shrink-0 bg-stone-100 hover:bg-brand-50 hover:text-brand-600 text-stone-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Read →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
