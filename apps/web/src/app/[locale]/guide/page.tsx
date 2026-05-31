import { getTranslations } from "next-intl/server";
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

const FALLBACK_GUIDES: GuideArticle[] = [
  { id: 1, slug: "microblading-business-basics",         title_en: "Starting Your Microblading Business: The Complete Guide",       title_ko: "마이크로블레이딩 창업 완전 가이드",               body_en: "Microblading has grown into a multi-billion dollar industry. This guide covers everything you need to launch a successful business.", category: "startup" },
  { id: 2, slug: "equipment-and-tools",                  title_en: "Essential Equipment & Tools for Microblading Professionals",     title_ko: "마이크로블레이딩 전문가를 위한 필수 장비 및 도구", body_en: "From sterile blades to professional-grade pigments, learn what equipment every microblading artist needs.", category: "technique" },
  { id: 3, slug: "client-consultation-guide",            title_en: "How to Conduct a Perfect Client Consultation",                  title_ko: "완벽한 고객 상담 방법",                           body_en: "A great consultation sets the foundation for a successful procedure. Learn the 5-step consultation framework.", category: "technique" },
  { id: 4, slug: "marketing-your-microblading-business", title_en: "Marketing Your Microblading Business in the Digital Age",       title_ko: "디지털 시대의 마이크로블레이딩 비즈니스 마케팅",   body_en: "Build your brand on Instagram, TikTok, and Google. Proven strategies to attract and retain clients.", category: "marketing" },
  { id: 5, slug: "aftercare-and-healing",                title_en: "Aftercare & Healing: What Clients Need to Know",                title_ko: "사후 관리 및 치유: 고객이 알아야 할 것",          body_en: "Proper aftercare is essential for long-lasting results. Guide your clients through the healing process.", category: "technique" },
];

const READ_TIME: Record<string, string> = {
  "microblading-business-basics":         "8",
  "equipment-and-tools":                  "6",
  "client-consultation-guide":            "7",
  "marketing-your-microblading-business": "5",
  "aftercare-and-healing":                "4",
};

const CATEGORY_ICONS: Record<string, string> = {
  startup:   "🚀",
  technique: "🎨",
  marketing: "📣",
};

const CATEGORY_STYLES: Record<string, string> = {
  startup:   "text-blue-700 bg-blue-50 border-blue-200",
  technique: "text-green-700 bg-green-50 border-green-200",
  marketing: "text-purple-700 bg-purple-50 border-purple-200",
};

export default async function GuidePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "guide" });

  const guides = await getGuides();
  const displayGuides = guides.length > 0 ? guides : FALLBACK_GUIDES;

  const categoryLabels: Record<string, string> = {
    startup:   t("category_startup"),
    technique: t("category_technique"),
    marketing: t("category_marketing"),
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
            {t("badge")}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-stone-300 text-lg max-w-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { v: displayGuides.length.toString(), l: t("stat_guides") },
              { v: "3",    l: t("stat_topics") },
              { v: t("stat_access"), l: "" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{s.v}</div>
                {s.l && <div className="text-xs text-stone-400">{s.l}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            <strong>{t("disclaimer_title")}</strong> — {t("disclaimer_body")}
          </span>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["startup", "technique", "marketing"] as const).map((key) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${CATEGORY_STYLES[key]}`}
            >
              {CATEGORY_ICONS[key]} {categoryLabels[key]}
            </span>
          ))}
        </div>

        {/* Guide cards */}
        <div className="space-y-4">
          {displayGuides.map((article, idx) => {
            const catStyle = CATEGORY_STYLES[article.category ?? ""];
            const catIcon  = CATEGORY_ICONS[article.category ?? ""];
            const catLabel = categoryLabels[article.category ?? ""] ?? article.category;
            const title = locale === "ko" && article.title_ko ? article.title_ko : article.title_en;
            const excerpt = article.body_en?.substring(0, 120);
            const readTime = READ_TIME[article.slug] ?? "5";

            return (
              <div
                key={article.id}
                className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-lg hover:-translate-y-1 hover:border-stone-200 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {catStyle && (
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
                            {catIcon} {catLabel}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {readTime} {t("min_read")}
                        </span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-stone-400">#{idx + 1}</span>
                      </div>

                      <h2 className="font-bold text-stone-900 text-lg leading-snug mb-2 group-hover:text-brand-600 transition-colors">
                        {title}
                      </h2>

                      {excerpt && (
                        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
                          {excerpt}...
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/guide/${article.slug}`}
                      className="shrink-0 flex items-center gap-1.5 bg-stone-50 hover:bg-brand-50 hover:text-brand-600 text-stone-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border border-stone-200 hover:border-brand-200"
                    >
                      {t("read_button")} <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-brand-500 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">{t("cta_title")}</h3>
          <p className="text-brand-100 text-sm mb-5">{t("cta_body")}</p>
          <Link
            href={`/${locale}/simulate`}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-brand-600 font-semibold px-6 py-3 rounded-xl transition-all shadow"
          >
            ✨ {t("cta_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
