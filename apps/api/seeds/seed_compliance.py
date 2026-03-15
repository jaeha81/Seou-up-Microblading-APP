"""Seed 5 compliance / legal notices."""

from sqlalchemy.orm import Session
from models.compliance import ComplianceNotice

COMPLIANCE_NOTICES = [
    {
        "key": "platform_disclaimer",
        "title_en": "Platform Disclaimer",
        "title_ko": "플랫폼 면책 조항",
        "title_th": "ข้อจำกัดความรับผิดชอบของแพลตฟอร์ม",
        "title_vi": "Tuyên bố từ chối trách nhiệm của nền tảng",
        "body_en": (
            "Seou-up Microblading is an information and visualization support platform only. "
            "We do not provide licensed medical or cosmetic procedure services. "
            "All simulations are for illustrative purposes only. "
            "Always consult a licensed and certified microblading professional before any procedure."
        ),
        "body_ko": (
            "Seou-up Microblading은 정보 및 시각화 지원 플랫폼입니다. "
            "면허가 있는 의료 또는 미용 시술 서비스를 제공하지 않습니다. "
            "모든 시뮬레이션은 설명 목적으로만 사용됩니다. "
            "시술 전 면허가 있는 인증된 마이크로블레이딩 전문가와 상담하세요."
        ),
        "body_th": (
            "Seou-up Microblading เป็นแพลตฟอร์มสนับสนุนข้อมูลและการแสดงภาพเท่านั้น "
            "เราไม่ได้ให้บริการทางการแพทย์หรือขั้นตอนเสริมความงามที่มีใบอนุญาต "
            "การจำลองทั้งหมดมีไว้เพื่อประกอบการอธิบายเท่านั้น"
        ),
        "body_vi": (
            "Seou-up Microblading chỉ là nền tảng hỗ trợ thông tin và trực quan hóa. "
            "Chúng tôi không cung cấp dịch vụ y tế hoặc thủ thuật thẩm mỹ có giấy phép. "
            "Tất cả các mô phỏng chỉ mang tính minh họa."
        ),
        "display_type": "Banner",
        "is_active": True,
    },
    {
        "key": "privacy_policy",
        "title_en": "Privacy Policy",
        "title_ko": "개인정보 처리방침",
        "title_th": "นโยบายความเป็นส่วนตัว",
        "title_vi": "Chính sách bảo mật",
        "body_en": (
            "We collect and process your personal information (email, uploaded photos) "
            "solely to provide simulation and platform services. "
            "Photos are stored securely and not shared with third parties. "
            "You may request deletion of your data at any time."
        ),
        "body_ko": (
            "이메일, 업로드된 사진 등 개인 정보는 시뮬레이션 및 플랫폼 서비스 제공 목적으로만 수집됩니다. "
            "사진은 안전하게 저장되며 제3자와 공유되지 않습니다. "
            "언제든지 데이터 삭제를 요청할 수 있습니다."
        ),
        "body_th": "เราเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของคุณเพื่อให้บริการแพลตฟอร์มเท่านั้น",
        "body_vi": "Chúng tôi thu thập và xử lý thông tin cá nhân của bạn chỉ để cung cấp dịch vụ nền tảng.",
        "display_type": "Footer",
        "is_active": True,
    },
    {
        "key": "terms_of_service",
        "title_en": "Terms of Service",
        "title_ko": "서비스 이용약관",
        "title_th": "ข้อกำหนดการให้บริการ",
        "title_vi": "Điều khoản dịch vụ",
        "body_en": (
            "By using Seou-up Microblading, you agree that: "
            "(1) this platform is for informational purposes only; "
            "(2) simulation results are not guarantees of actual procedure outcomes; "
            "(3) you are responsible for verifying the credentials of any professional you engage."
        ),
        "body_ko": (
            "Seou-up Microblading을 사용함으로써 다음에 동의합니다: "
            "(1) 이 플랫폼은 정보 제공 목적으로만 사용됩니다; "
            "(2) 시뮬레이션 결과는 실제 시술 결과의 보장이 아닙니다; "
            "(3) 귀하가 참여하는 전문가의 자격 증명 확인은 귀하의 책임입니다."
        ),
        "body_th": "การใช้ Seou-up Microblading แสดงว่าคุณยอมรับว่าแพลตฟอร์มนี้มีไว้เพื่อให้ข้อมูลเท่านั้น",
        "body_vi": "Bằng cách sử dụng Seou-up Microblading, bạn đồng ý rằng nền tảng này chỉ dành cho mục đích thông tin.",
        "display_type": "Modal",
        "is_active": True,
    },
    {
        "key": "photo_consent",
        "title_en": "Photo Upload Consent",
        "title_ko": "사진 업로드 동의",
        "title_th": "ความยินยอมในการอัปโหลดรูปภาพ",
        "title_vi": "Đồng ý tải lên ảnh",
        "body_en": (
            "By uploading a photo, you consent to its temporary processing for simulation purposes. "
            "Your photo is not used for training AI models or shared publicly. "
            "Photos are automatically deleted after 30 days."
        ),
        "body_ko": (
            "사진을 업로드함으로써 시뮬레이션 목적의 임시 처리에 동의합니다. "
            "사진은 AI 모델 훈련이나 공개적으로 공유되지 않습니다. "
            "사진은 30일 후 자동 삭제됩니다."
        ),
        "body_th": "การอัปโหลดรูปภาพ คุณยินยอมให้ประมวลผลชั่วคราวเพื่อจุดประสงค์การจำลอง",
        "body_vi": "Bằng cách tải ảnh lên, bạn đồng ý xử lý tạm thời cho mục đích mô phỏng.",
        "display_type": "Inline",
        "is_active": True,
    },
    {
        "key": "medical_disclaimer",
        "title_en": "Medical Disclaimer",
        "title_ko": "의료 면책 조항",
        "title_th": "ข้อจำกัดความรับผิดชอบทางการแพทย์",
        "title_vi": "Tuyên bố từ chối trách nhiệm y tế",
        "body_en": (
            "Microblading is a cosmetic procedure that involves minor skin penetration. "
            "It is not suitable for individuals who are pregnant, nursing, have skin conditions "
            "in the brow area, keloid tendencies, or take blood-thinning medications. "
            "Seou-up does not provide medical advice. Consult your physician before any procedure."
        ),
        "body_ko": (
            "마이크로블레이딩은 약간의 피부 침투를 포함하는 미용 시술입니다. "
            "임신 중이거나 수유 중이거나, 눈썹 부위에 피부 질환이 있거나, "
            "켈로이드 경향이 있거나, 혈액 희석제를 복용하는 분에게는 적합하지 않습니다. "
            "Seou-up은 의료 조언을 제공하지 않습니다. 시술 전 의사와 상담하세요."
        ),
        "body_th": "ไมโครเบลดดิ้งเป็นขั้นตอนทางเสริมความงามที่เกี่ยวข้องกับการเจาะผิวหนังเล็กน้อย Seou-up ไม่ได้ให้คำแนะนำทางการแพทย์",
        "body_vi": "Microblading là thủ thuật thẩm mỹ liên quan đến việc xâm nhập da nhỏ. Seou-up không cung cấp lời khuyên y tế.",
        "display_type": "Banner",
        "is_active": True,
    },
]


def seed_compliance(db: Session) -> int:
    created = 0
    for data in COMPLIANCE_NOTICES:
        existing = (
            db.query(ComplianceNotice)
            .filter(ComplianceNotice.key == data["key"])
            .first()
        )
        if not existing:
            notice = ComplianceNotice(**data)
            db.add(notice)
            created += 1
    db.commit()
    return created
