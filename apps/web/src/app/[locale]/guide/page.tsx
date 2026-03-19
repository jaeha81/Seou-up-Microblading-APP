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

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  startup:   { icon: "🚀", label: "Startup",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  technique: { icon: "🎨", label: "Technique", color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  marketing: { icon: "📣", label: "Marketing", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

const READ_TIME: Record<string, string> = {
  "microblading-business-basics":         "8 min read",
  "equipment-and-tools":                  "6 min read",
  "client-consultation-guide":            "7 min read",
  "marketing-your-microblading-business": "5 min read",
  "aftercare-and-healing":                "4 min read",
};

export default async function GuidePage({ params }: { params: { locale: string } }) {
  const guides = await getGuides();
  const displayGuides = guides.length > 0 ? guides : FALLBACK_GUIDES;
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
            Knowledge Base
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Startup Guide
          </h1>
          <p className="text-stone-300 text-lg max-w-xl">
            Everything you need to launch and grow your microblading business —
            from first blade to full studio.
          </p>

          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { v: displayGuides.length.toString(), l: "Expert Guides" },
              { v: "3", l: "Topics" },
              { v: "Free", l: "Access" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-stone-400">{s.l}</div>
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
            <strong>Educational Content Only</strong> — All guides are for informational purposes.
            Always verify local licensing and health regulations in your jurisdiction.
          </span>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
            >
              {cfg.icon} {cfg.label}
            </span>
          ))}
        </div>

        {/* Guide cards */}
        <div className="space-y-4">
          {displayGuides.map((article, idx) => {
            const cfg = CATEGORY_CONFIG[article.category ?? ""];
            const title = locale === "ko" && article.title_ko ? article.title_ko : article.title_en;
            const excerpt = article.body_en?.substring(0, 120);

            return (
              <div
                key={article.id}
                className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {cfg && (
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        )}
                        <span className="text-xs text-stone-400">{READ_TIME[article.slug] ?? "5 min read"}</span>
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
                      Read <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-brand-500 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Ready to visualize brow styles?</h3>
          <p className="text-brand-100 text-sm mb-5">
            Try our brow simulator — preview 12 styles on your own photo before any procedure.
          </p>
          <Link
            href={`/${locale}/simulate`}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-brand-600 font-semibold px-6 py-3 rounded-xl transition-all shadow"
          >
            ✨ Open Brow Simulator →
          </Link>
        </div>
      </div>
    </div>
  );
}
