import Link from "next/link";

const NOTICES = [
  {
    key: "platform_disclaimer",
    icon: "⚠️",
    title: { en: "Platform Disclaimer", ko: "플랫폼 면책 조항" },
    body: {
      en: "Seou-up Microblading is an information and visualization support platform only. We do not provide licensed medical or cosmetic procedure services. All simulations are for illustrative purposes only. Always consult a licensed and certified microblading professional before any procedure.",
      ko: "Seou-up Microblading은 정보 및 시각화 지원 플랫폼입니다. 면허가 있는 의료 또는 미용 시술 서비스를 제공하지 않습니다. 모든 시뮬레이션은 설명 목적으로만 사용됩니다. 시술 전 면허가 있는 인증된 마이크로블레이딩 전문가와 상담하세요.",
    },
  },
  {
    key: "medical_disclaimer",
    icon: "🏥",
    title: { en: "Medical Disclaimer", ko: "의료 면책 조항" },
    body: {
      en: "Microblading is a cosmetic procedure that involves minor skin penetration. It is not suitable for individuals who are pregnant, nursing, have skin conditions in the brow area, keloid tendencies, or take blood-thinning medications. Seou-up does not provide medical advice. Consult your physician before any procedure.",
      ko: "마이크로블레이딩은 약간의 피부 침투를 포함하는 미용 시술입니다. 임신 중이거나 수유 중이거나, 눈썹 부위에 피부 질환이 있거나, 켈로이드 경향이 있거나, 혈액 희석제를 복용하는 분에게는 적합하지 않습니다. Seou-up은 의료 조언을 제공하지 않습니다.",
    },
  },
  {
    key: "privacy_policy",
    icon: "🔒",
    title: { en: "Privacy Policy", ko: "개인정보 처리방침" },
    body: {
      en: "We collect and process your personal information (email, uploaded photos) solely to provide simulation and platform services. Photos are stored securely and not shared with third parties. Photos are automatically deleted after 30 days. You may request deletion of your data at any time by contacting us.",
      ko: "이메일, 업로드된 사진 등 개인 정보는 시뮬레이션 및 플랫폼 서비스 제공 목적으로만 수집됩니다. 사진은 안전하게 저장되며 제3자와 공유되지 않습니다. 사진은 30일 후 자동 삭제됩니다.",
    },
  },
  {
    key: "terms_of_service",
    icon: "📋",
    title: { en: "Terms of Service", ko: "서비스 이용약관" },
    body: {
      en: "By using Seou-up Microblading, you agree that: (1) this platform is for informational purposes only; (2) simulation results are not guarantees of actual procedure outcomes; (3) you are responsible for verifying the credentials of any professional you engage; (4) you must be 18+ to use this platform.",
      ko: "Seou-up Microblading을 사용함으로써 다음에 동의합니다: (1) 이 플랫폼은 정보 제공 목적으로만 사용됩니다; (2) 시뮬레이션 결과는 실제 시술 결과의 보장이 아닙니다; (3) 이용하는 전문가의 자격을 직접 확인할 책임이 있습니다.",
    },
  },
  {
    key: "photo_consent",
    icon: "📷",
    title: { en: "Photo Upload Consent", ko: "사진 업로드 동의" },
    body: {
      en: "By uploading a photo, you consent to its temporary processing for simulation purposes. Your photo is not used for training AI models, sold, or shared publicly. Photos are automatically deleted after 30 days. Only front-facing photos should be uploaded.",
      ko: "사진을 업로드함으로써 시뮬레이션 목적의 임시 처리에 동의합니다. 사진은 AI 모델 훈련이나 공개적으로 공유되지 않습니다. 사진은 30일 후 자동 삭제됩니다.",
    },
  },
];

export default function LegalPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
            Legal
          </span>
          <h1 className="font-serif text-4xl font-bold mb-3">Legal Notices &amp; Terms</h1>
          <p className="text-stone-300 max-w-xl">
            Please read these notices carefully. Seou-up is a visualization and information
            platform only — not a licensed medical or procedure provider.
          </p>
          <p className="text-xs text-stone-500 mt-4">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* TOC */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Contents</p>
          <div className="flex flex-wrap gap-2">
            {NOTICES.map((n) => (
              <a
                key={n.key}
                href={`#${n.key}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-500 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors"
              >
                {n.icon} {locale === "ko" ? n.title.ko : n.title.en}
              </a>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="space-y-4">
          {NOTICES.map((notice, idx) => {
            const title = locale === "ko" ? notice.title.ko : notice.title.en;
            const body  = locale === "ko" ? notice.body.ko  : notice.body.en;
            return (
              <div
                key={notice.key}
                id={notice.key}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden scroll-mt-20"
              >
                <div className="px-6 py-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {notice.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-stone-400 font-medium">§{idx + 1}</span>
                      <h2 className="font-bold text-stone-900">{title}</h2>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 bg-stone-900 rounded-2xl p-6 text-center">
          <p className="text-sm text-stone-300 mb-4">
            Seou-up Microblading is an information and visualization support platform only.
            Not a licensed medical or procedure provider.
          </p>
          <div className="flex justify-center gap-4 text-xs text-stone-500">
            <Link href={`/${locale}/feedback`} className="hover:text-brand-400 transition-colors">
              Contact Us
            </Link>
            <span>·</span>
            <Link href={`/${locale}`} className="hover:text-brand-400 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
