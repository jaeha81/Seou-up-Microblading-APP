"""Seed 5 startup guide articles."""

from sqlalchemy.orm import Session
from models.guide import GuideArticle

GUIDE_ARTICLES = [
    {
        "slug": "microblading-business-basics",
        "title_en": "Starting Your Microblading Business: The Complete Guide",
        "title_ko": "마이크로블레이딩 창업 완전 가이드",
        "title_th": "เริ่มต้นธุรกิจไมโครเบลดดิ้ง: คู่มือฉบับสมบูรณ์",
        "title_vi": "Bắt đầu kinh doanh Microblading: Hướng dẫn đầy đủ",
        "body_en": (
            "## Introduction\n\n"
            "Microblading is a semi-permanent eyebrow tattooing technique that has grown "
            "into a multi-billion dollar industry. This guide covers everything you need "
            "to launch a successful microblading business.\n\n"
            "## Key Steps\n\n"
            "1. **Complete Certified Training** — Choose an accredited microblading program.\n"
            "2. **Obtain Licenses** — Check local regulations (cosmetology, tattoo artist license).\n"
            "3. **Set Up Your Space** — Hygiene-compliant studio with proper lighting.\n"
            "4. **Build Your Portfolio** — Practice on models before charging clients.\n"
            "5. **Set Your Pricing** — Research local market rates.\n\n"
            "⚠️ **Disclaimer**: This information is for educational purposes only. "
            "Always comply with local health and licensing regulations."
        ),
        "body_ko": (
            "## 소개\n\n"
            "마이크로블레이딩은 수십억 달러 규모의 산업으로 성장한 반영구 눈썹 문신 기술입니다. "
            "이 가이드는 성공적인 마이크로블레이딩 사업을 시작하는 데 필요한 모든 것을 다룹니다.\n\n"
            "## 주요 단계\n\n"
            "1. **인증 교육 수료** — 공인된 마이크로블레이딩 프로그램을 선택하세요.\n"
            "2. **면허 취득** — 지역 규정(미용사, 타투 아티스트 면허)을 확인하세요.\n"
            "3. **공간 설정** — 적절한 조명이 있는 위생 규정 준수 스튜디오.\n"
            "4. **포트폴리오 구성** — 고객에게 청구하기 전에 모델에게 연습하세요.\n"
            "5. **가격 설정** — 지역 시장 가격을 조사하세요.\n\n"
            "⚠️ **면책 조항**: 이 정보는 교육 목적으로만 제공됩니다. "
            "항상 지역 건강 및 면허 규정을 준수하세요."
        ),
        "category": "startup",
        "sort_order": 1,
    },
    {
        "slug": "equipment-and-tools",
        "title_en": "Essential Equipment & Tools for Microblading Professionals",
        "title_ko": "마이크로블레이딩 전문가를 위한 필수 장비 및 도구",
        "title_th": "อุปกรณ์และเครื่องมือที่จำเป็นสำหรับมืออาชีพด้านไมโครเบลดดิ้ง",
        "title_vi": "Thiết bị & Dụng cụ cần thiết cho chuyên gia Microblading",
        "body_en": (
            "## Essential Tools\n\n"
            "- **Microblading Pens** — Manual or digital, use sterile single-use blades.\n"
            "- **Pigments** — High-quality, body-safe pigments in a range of shades.\n"
            "- **Numbing Cream** — For client comfort (check local regulations on use).\n"
            "- **Measurement Tools** — Golden ratio calipers, brow stencils.\n"
            "- **Aftercare Products** — Healing balm, sterile gauze.\n\n"
            "⚠️ Always use sterile, single-use equipment. Follow biohazard disposal regulations."
        ),
        "body_ko": (
            "## 필수 도구\n\n"
            "- **마이크로블레이딩 펜** — 수동 또는 디지털, 멸균 일회용 블레이드 사용.\n"
            "- **색소** — 다양한 색조의 고품질, 신체 안전 색소.\n"
            "- **마취 크림** — 고객 편의를 위해 (사용에 관한 지역 규정 확인).\n"
            "- **측정 도구** — 황금 비율 캘리퍼스, 눈썹 스텐실.\n"
            "- **애프터케어 제품** — 치료 밤, 멸균 거즈.\n\n"
            "⚠️ 항상 멸균된 일회용 장비를 사용하세요. 생물학적 위험물 처리 규정을 따르세요."
        ),
        "category": "technique",
        "sort_order": 2,
    },
    {
        "slug": "client-consultation-guide",
        "title_en": "How to Conduct a Perfect Client Consultation",
        "title_ko": "완벽한 고객 상담 방법",
        "title_th": "วิธีดำเนินการให้คำปรึกษาลูกค้าที่สมบูรณ์แบบ",
        "title_vi": "Cách thực hiện tư vấn khách hàng hoàn hảo",
        "body_en": (
            "## The Consultation Process\n\n"
            "A thorough consultation is essential for client satisfaction and safety.\n\n"
            "### Steps:\n"
            "1. **Medical History Review** — Screen for contraindications (blood thinners, skin conditions).\n"
            "2. **Brow Analysis** — Assess natural brow shape, face symmetry.\n"
            "3. **Style Discussion** — Use the Seou-up simulation tool to preview styles.\n"
            "4. **Informed Consent** — Explain the procedure, risks, and aftercare.\n"
            "5. **Allergy Patch Test** — Always perform 24-48 hours before the procedure.\n\n"
            "⚠️ **Important**: Microblading is not suitable for everyone. "
            "Always conduct a thorough medical history review. This platform assists "
            "with visualization only — consult a licensed professional."
        ),
        "body_ko": (
            "## 상담 프로세스\n\n"
            "철저한 상담은 고객 만족과 안전에 필수적입니다.\n\n"
            "### 단계:\n"
            "1. **병력 검토** — 금기 사항 확인 (혈액 희석제, 피부 상태).\n"
            "2. **눈썹 분석** — 자연 눈썹 모양, 얼굴 대칭 평가.\n"
            "3. **스타일 논의** — Seou-up 시뮬레이션 도구를 사용하여 스타일 미리보기.\n"
            "4. **정보에 입각한 동의** — 시술, 위험 및 사후 관리 설명.\n"
            "5. **알레르기 패치 테스트** — 시술 24-48시간 전 항상 실시.\n\n"
            "⚠️ **중요**: 마이크로블레이딩은 모든 사람에게 적합하지 않습니다. "
            "항상 철저한 병력 검토를 실시하세요. 이 플랫폼은 시각화만 지원합니다 — "
            "면허가 있는 전문가와 상담하세요."
        ),
        "category": "technique",
        "sort_order": 3,
    },
    {
        "slug": "marketing-your-microblading-business",
        "title_en": "Marketing Your Microblading Business in the Digital Age",
        "title_ko": "디지털 시대의 마이크로블레이딩 비즈니스 마케팅",
        "title_th": "การตลาดธุรกิจไมโครเบลดดิ้งในยุคดิจิทัล",
        "title_vi": "Tiếp thị doanh nghiệp Microblading trong thời đại số",
        "body_en": (
            "## Digital Marketing Strategies\n\n"
            "### Social Media\n"
            "- Instagram & TikTok: Before/after photos, time-lapse videos.\n"
            "- Pinterest: Style inspiration boards.\n"
            "- Facebook Groups: Local beauty communities.\n\n"
            "### SEO & Local Search\n"
            "- Google Business Profile with before/after photos.\n"
            "- Local keywords: 'microblading [city name]'.\n\n"
            "### Client Referrals\n"
            "- Referral discounts for existing clients.\n"
            "- Partner with local beauty salons.\n\n"
            "⚠️ Ensure all marketing materials include appropriate disclaimers about "
            "the cosmetic nature of the procedure."
        ),
        "body_ko": (
            "## 디지털 마케팅 전략\n\n"
            "### 소셜 미디어\n"
            "- 인스타그램 & 틱톡: 전후 사진, 타임랩스 동영상.\n"
            "- 핀터레스트: 스타일 영감 보드.\n"
            "- 페이스북 그룹: 지역 뷰티 커뮤니티.\n\n"
            "### SEO & 로컬 검색\n"
            "- 전후 사진이 있는 구글 비즈니스 프로필.\n"
            "- 지역 키워드: '마이크로블레이딩 [도시명]'.\n\n"
            "### 고객 추천\n"
            "- 기존 고객을 위한 추천 할인.\n"
            "- 지역 뷰티 살롱과 파트너십.\n\n"
            "⚠️ 모든 마케팅 자료에 시술의 미용적 성격에 대한 적절한 면책 조항을 포함하세요."
        ),
        "category": "marketing",
        "sort_order": 4,
    },
    {
        "slug": "aftercare-and-healing",
        "title_en": "Aftercare & Healing: What Clients Need to Know",
        "title_ko": "사후 관리 및 치유: 고객이 알아야 할 것",
        "title_th": "การดูแลหลังและการรักษา: สิ่งที่ลูกค้าต้องรู้",
        "title_vi": "Chăm sóc sau & Chữa lành: Điều khách hàng cần biết",
        "body_en": (
            "## Aftercare Instructions\n\n"
            "Proper aftercare is crucial for beautiful, long-lasting results.\n\n"
            "### First 7 Days:\n"
            "- Keep brows dry — no swimming, sweating, or steam rooms.\n"
            "- Apply healing balm as directed (thin layer, twice daily).\n"
            "- Do not pick or scratch scabs.\n"
            "- Avoid makeup on the brow area.\n\n"
            "### Weeks 2-4:\n"
            "- Brows will appear lighter as they heal — this is normal.\n"
            "- Avoid direct sun exposure.\n"
            "- No retinol or acids on the brow area.\n\n"
            "### Touch-up:\n"
            "Schedule a touch-up session 4-8 weeks after the initial procedure.\n\n"
            "⚠️ **Medical Disclaimer**: Any reactions, excessive swelling, or signs of "
            "infection should be evaluated by a medical professional immediately. "
            "This information is educational only."
        ),
        "body_ko": (
            "## 사후 관리 지침\n\n"
            "적절한 사후 관리는 아름답고 오래 지속되는 결과를 위해 매우 중요합니다.\n\n"
            "### 첫 7일:\n"
            "- 눈썹을 건조하게 유지 — 수영, 땀 흘리기, 스팀룸 금지.\n"
            "- 지시에 따라 치료 밤 바르기 (얇은 층, 하루 두 번).\n"
            "- 딱지를 뜯거나 긁지 마세요.\n"
            "- 눈썹 부위에 화장 금지.\n\n"
            "### 2-4주:\n"
            "- 치유되면서 눈썹이 밝아 보일 수 있습니다 — 정상입니다.\n"
            "- 직사광선 피하기.\n"
            "- 눈썹 부위에 레티놀이나 산 금지.\n\n"
            "### 터치업:\n"
            "첫 시술 4-8주 후 터치업 세션을 예약하세요.\n\n"
            "⚠️ **의료 면책 조항**: 반응, 과도한 붓기 또는 감염 징후는 즉시 의료 전문가의 "
            "평가를 받아야 합니다. 이 정보는 교육 목적으로만 제공됩니다."
        ),
        "category": "technique",
        "sort_order": 5,
    },
]


def seed_guides(db: Session) -> int:
    created = 0
    for data in GUIDE_ARTICLES:
        existing = (
            db.query(GuideArticle).filter(GuideArticle.slug == data["slug"]).first()
        )
        if not existing:
            article = GuideArticle(**data)
            db.add(article)
            created += 1
    db.commit()
    return created
