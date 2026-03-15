export default function LegalPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  const notices = [
    {
      key: "platform_disclaimer",
      title: { en: "Platform Disclaimer", ko: "플랫폼 면책 조항" },
      body: {
        en: "Seou-up Microblading is an information and visualization support platform only. We do not provide licensed medical or cosmetic procedure services. All simulations are for illustrative purposes only. Always consult a licensed and certified microblading professional before any procedure.",
        ko: "Seou-up Microblading은 정보 및 시각화 지원 플랫폼입니다. 면허가 있는 의료 또는 미용 시술 서비스를 제공하지 않습니다. 모든 시뮬레이션은 설명 목적으로만 사용됩니다. 시술 전 면허가 있는 인증된 마이크로블레이딩 전문가와 상담하세요.",
      },
    },
    {
      key: "medical_disclaimer",
      title: { en: "Medical Disclaimer", ko: "의료 면책 조항" },
      body: {
        en: "Microblading is a cosmetic procedure that involves minor skin penetration. It is not suitable for individuals who are pregnant, nursing, have skin conditions in the brow area, keloid tendencies, or take blood-thinning medications. Seou-up does not provide medical advice. Consult your physician before any procedure.",
        ko: "마이크로블레이딩은 약간의 피부 침투를 포함하는 미용 시술입니다. 임신 중이거나 수유 중이거나, 눈썹 부위에 피부 질환이 있거나, 켈로이드 경향이 있거나, 혈액 희석제를 복용하는 분에게는 적합하지 않습니다.",
      },
    },
    {
      key: "privacy_policy",
      title: { en: "Privacy Policy", ko: "개인정보 처리방침" },
      body: {
        en: "We collect and process your personal information (email, uploaded photos) solely to provide simulation and platform services. Photos are stored securely and not shared with third parties. You may request deletion of your data at any time by contacting us.",
        ko: "이메일, 업로드된 사진 등 개인 정보는 시뮬레이션 및 플랫폼 서비스 제공 목적으로만 수집됩니다. 사진은 안전하게 저장되며 제3자와 공유되지 않습니다.",
      },
    },
    {
      key: "terms_of_service",
      title: { en: "Terms of Service", ko: "서비스 이용약관" },
      body: {
        en: "By using Seou-up Microblading, you agree that: (1) this platform is for informational purposes only; (2) simulation results are not guarantees of actual procedure outcomes; (3) you are responsible for verifying the credentials of any professional you engage.",
        ko: "Seou-up Microblading을 사용함으로써 다음에 동의합니다: (1) 이 플랫폼은 정보 제공 목적으로만 사용됩니다; (2) 시뮬레이션 결과는 실제 시술 결과의 보장이 아닙니다.",
      },
    },
    {
      key: "photo_consent",
      title: { en: "Photo Upload Consent", ko: "사진 업로드 동의" },
      body: {
        en: "By uploading a photo, you consent to its temporary processing for simulation purposes. Your photo is not used for training AI models or shared publicly. Photos are automatically deleted after 30 days.",
        ko: "사진을 업로드함으로써 시뮬레이션 목적의 임시 처리에 동의합니다. 사진은 AI 모델 훈련이나 공개적으로 공유되지 않습니다. 사진은 30일 후 자동 삭제됩니다.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Legal Notices</h1>
        <p className="text-stone-600 mb-8">
          Please read these notices carefully. Seou-up is a visualization and information platform only.
        </p>

        <div className="space-y-6">
          {notices.map((notice) => {
            const title = locale === "ko" ? notice.title.ko : notice.title.en;
            const body = locale === "ko" ? notice.body.ko : notice.body.en;
            return (
              <div key={notice.key} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <h2 className="font-semibold text-stone-900 mb-3">{title}</h2>
                <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-stone-800 rounded-2xl text-center">
          <p className="text-sm text-stone-300">
            Seou-up Microblading is an information and visualization support platform only.
            Not a licensed medical or procedure provider.
          </p>
        </div>
      </div>
    </div>
  );
}
