import Link from "next/link";
import { notFound } from "next/navigation";

interface GuideArticle {
  id: number;
  slug: string;
  title_en: string;
  title_ko: string | null;
  title_th: string | null;
  title_vi: string | null;
  body_en: string | null;
  body_ko: string | null;
  body_th: string | null;
  body_vi: string | null;
  category: string | null;
  cover_image_url: string | null;
  created_at: string;
}

// Fallback seed data (mirrors seed_guides.py) — shown when API is offline
const FALLBACK: Record<string, GuideArticle> = {
  "microblading-business-basics": {
    id: 1, slug: "microblading-business-basics",
    title_en: "Starting Your Microblading Business: The Complete Guide",
    title_ko: "마이크로블레이딩 창업 완전 가이드",
    title_th: "เริ่มต้นธุรกิจไมโครเบลดดิ้ง: คู่มือฉบับสมบูรณ์",
    title_vi: "Bắt đầu kinh doanh Microblading: Hướng dẫn đầy đủ",
    body_en: "## Introduction\n\nMicroblading is a semi-permanent eyebrow tattooing technique that has grown into a multi-billion dollar industry. This guide covers everything you need to launch a successful microblading business.\n\n## Key Steps\n\n1. **Complete Certified Training** — Choose an accredited microblading program.\n2. **Obtain Licenses** — Check local regulations (cosmetology, tattoo artist license).\n3. **Set Up Your Space** — Hygiene-compliant studio with proper lighting.\n4. **Build Your Portfolio** — Practice on models before charging clients.\n5. **Set Your Pricing** — Research local market rates.\n\n⚠️ **Disclaimer**: This information is for educational purposes only. Always comply with local health and licensing regulations.",
    body_ko: "## 소개\n\n마이크로블레이딩은 수십억 달러 규모의 산업으로 성장한 반영구 눈썹 문신 기술입니다.\n\n## 주요 단계\n\n1. **인증 교육 수료** — 공인된 마이크로블레이딩 프로그램을 선택하세요.\n2. **면허 취득** — 지역 규정을 확인하세요.\n3. **공간 설정** — 적절한 조명이 있는 위생 규정 준수 스튜디오.\n4. **포트폴리오 구성** — 고객에게 청구하기 전에 모델에게 연습하세요.\n5. **가격 설정** — 지역 시장 가격을 조사하세요.\n\n⚠️ **면책 조항**: 이 정보는 교육 목적으로만 제공됩니다.",
    body_th: null, body_vi: null, category: "startup", cover_image_url: null, created_at: "2026-03-15T00:00:00Z",
  },
  "equipment-and-tools": {
    id: 2, slug: "equipment-and-tools",
    title_en: "Essential Equipment & Tools for Microblading Professionals",
    title_ko: "마이크로블레이딩 전문가를 위한 필수 장비 및 도구",
    title_th: "อุปกรณ์และเครื่องมือที่จำเป็น", title_vi: "Thiết bị & Dụng cụ cần thiết",
    body_en: "## Essential Tools\n\n- **Microblading Pens** — Manual or digital, use sterile single-use blades.\n- **Pigments** — High-quality, body-safe pigments in a range of shades.\n- **Numbing Cream** — For client comfort (check local regulations on use).\n- **Measurement Tools** — Golden ratio calipers, brow stencils.\n- **Aftercare Products** — Healing balm, sterile gauze.\n\n⚠️ Always use sterile, single-use equipment. Follow biohazard disposal regulations.",
    body_ko: "## 필수 도구\n\n- **마이크로블레이딩 펜** — 수동 또는 디지털, 멸균 일회용 블레이드 사용.\n- **색소** — 다양한 색조의 고품질, 신체 안전 색소.\n- **마취 크림** — 고객 편의를 위해.\n\n⚠️ 항상 멸균된 일회용 장비를 사용하세요.",
    body_th: null, body_vi: null, category: "technique", cover_image_url: null, created_at: "2026-03-15T00:00:00Z",
  },
  "client-consultation-guide": {
    id: 3, slug: "client-consultation-guide",
    title_en: "How to Conduct a Perfect Client Consultation",
    title_ko: "완벽한 고객 상담 방법",
    title_th: "วิธีดำเนินการให้คำปรึกษาลูกค้า", title_vi: "Cách thực hiện tư vấn khách hàng",
    body_en: "## The Consultation Process\n\n1. **Medical History Review** — Screen for contraindications.\n2. **Brow Analysis** — Assess natural brow shape and face symmetry.\n3. **Style Discussion** — Use the Seou-up simulation tool to preview styles.\n4. **Informed Consent** — Explain the procedure, risks, and aftercare.\n5. **Allergy Patch Test** — Always perform 24-48 hours before the procedure.\n\n⚠️ **Important**: Always consult a licensed professional. This platform assists with visualization only.",
    body_ko: "## 상담 프로세스\n\n1. **병력 검토** — 금기 사항 확인.\n2. **눈썹 분석** — 자연 눈썹 모양 평가.\n3. **스타일 논의** — Seou-up 시뮬레이션 도구 활용.\n4. **정보에 입각한 동의** — 시술, 위험 및 사후 관리 설명.\n5. **알레르기 패치 테스트** — 시술 24-48시간 전 실시.",
    body_th: null, body_vi: null, category: "technique", cover_image_url: null, created_at: "2026-03-15T00:00:00Z",
  },
  "marketing-your-microblading-business": {
    id: 4, slug: "marketing-your-microblading-business",
    title_en: "Marketing Your Microblading Business in the Digital Age",
    title_ko: "디지털 시대의 마이크로블레이딩 비즈니스 마케팅",
    title_th: "การตลาดธุรกิจไมโครเบลดดิ้ง", title_vi: "Tiếp thị doanh nghiệp Microblading",
    body_en: "## Digital Marketing Strategies\n\n### Social Media\n- Instagram & TikTok: Before/after photos, time-lapse videos.\n- Pinterest: Style inspiration boards.\n- Facebook Groups: Local beauty communities.\n\n### SEO & Local Search\n- Google Business Profile with before/after photos.\n- Local keywords: 'microblading [city name]'.\n\n### Client Referrals\n- Referral discounts for existing clients.\n- Partner with local beauty salons.",
    body_ko: "## 디지털 마케팅 전략\n\n### 소셜 미디어\n- 인스타그램 & 틱톡: 전후 사진, 타임랩스 동영상.\n\n### SEO & 로컬 검색\n- 구글 비즈니스 프로필.\n\n### 고객 추천\n- 기존 고객을 위한 추천 할인.",
    body_th: null, body_vi: null, category: "marketing", cover_image_url: null, created_at: "2026-03-15T00:00:00Z",
  },
  "aftercare-and-healing": {
    id: 5, slug: "aftercare-and-healing",
    title_en: "Aftercare & Healing: What Clients Need to Know",
    title_ko: "사후 관리 및 치유: 고객이 알아야 할 것",
    title_th: "การดูแลหลังและการรักษา", title_vi: "Chăm sóc sau & Chữa lành",
    body_en: "## Aftercare Instructions\n\n### First 7 Days\n- Keep brows dry — no swimming, sweating, or steam rooms.\n- Apply healing balm as directed (thin layer, twice daily).\n- Do not pick or scratch scabs.\n\n### Weeks 2-4\n- Brows will appear lighter as they heal — this is normal.\n- Avoid direct sun exposure.\n\n### Touch-up\nSchedule a touch-up 4-8 weeks after the initial procedure.\n\n⚠️ Any reactions or signs of infection should be evaluated by a medical professional immediately.",
    body_ko: "## 사후 관리 지침\n\n### 첫 7일\n- 눈썹을 건조하게 유지.\n- 치료 밤 하루 두 번 바르기.\n- 딱지를 뜯거나 긁지 마세요.\n\n### 2-4주\n- 눈썹이 밝아 보일 수 있습니다 — 정상입니다.\n\n⚠️ 반응이나 감염 징후는 즉시 의료 전문가의 평가를 받으세요.",
    body_th: null, body_vi: null, category: "technique", cover_image_url: null, created_at: "2026-03-15T00:00:00Z",
  },
};

async function getArticle(slug: string): Promise<GuideArticle | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/guides/${slug}`, { cache: "no-store" });
    if (!res.ok) return FALLBACK[slug] ?? null;
    return res.json();
  } catch {
    return FALLBACK[slug] ?? null;
  }
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-stone-900 mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-stone-800 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-stone-700">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-stone-700"><strong>$2</strong></li>')
    .replace(/⚠️ \*\*(.+?)\*\*: (.+)/g, '<p class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 mt-4"><strong>⚠️ $1</strong>: $2</p>')
    .replace(/⚠️ (.+)/g, '<p class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 mt-4">⚠️ $1</p>')
    .replace(/\n\n/g, '</p><p class="text-stone-700 leading-relaxed mb-4">')
    .replace(/^(?!<)(.+)$/gm, '<p class="text-stone-700 leading-relaxed mb-4">$1</p>');
}

const CATEGORY_COLORS: Record<string, string> = {
  startup: "bg-blue-100 text-blue-700",
  technique: "bg-green-100 text-green-700",
  marketing: "bg-purple-100 text-purple-700",
};

export default async function GuideDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const title =
    locale === "ko" && article.title_ko ? article.title_ko :
    locale === "th" && article.title_th ? article.title_th :
    locale === "vi" && article.title_vi ? article.title_vi :
    article.title_en;

  const body =
    locale === "ko" && article.body_ko ? article.body_ko :
    locale === "th" && article.body_th ? article.body_th :
    locale === "vi" && article.body_vi ? article.body_vi :
    article.body_en;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href={`/${locale}/guide`}
          className="text-sm text-brand-500 hover:underline mb-6 inline-block"
        >
          ← Back to Guide
        </Link>

        {/* Category Badge */}
        {article.category && (
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${
              CATEGORY_COLORS[article.category] ?? "bg-stone-100 text-stone-600"
            }`}
          >
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        )}

        <h1 className="text-3xl font-bold text-stone-900 mb-2 leading-tight">{title}</h1>
        <p className="text-xs text-stone-400 mb-8">
          {new Date(article.created_at).toLocaleDateString(locale, {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Educational Content Only</strong> — This guide is for informational purposes.
          Always verify local licensing and health regulations. Seou-up is a visualization platform only.
        </div>

        {/* Body */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          {body ? (
            <div
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
            />
          ) : (
            <p className="text-stone-500 italic">Content coming soon.</p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 text-center">
          <p className="font-semibold text-stone-900 mb-2">Ready to preview brow styles?</p>
          <p className="text-sm text-stone-600 mb-4">
            Try our brow simulator to visualize styles before any procedure.
          </p>
          <Link
            href={`/${locale}/simulate`}
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Open Brow Simulator →
          </Link>
        </div>
      </div>
    </div>
  );
}
