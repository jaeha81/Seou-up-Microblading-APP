import json, os

MESSAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "messages")

AUTH_EXTRA = {
    "register_step1_label": "Choose Role",
    "register_step2_label": "Account Details",
    "register_personalize": "Tell us who you are to personalize your experience",
    "register_creating_account": "Creating your {role} account",
    "register_continue_as": "Continue as {role}",
    "register_creating": "Creating...",
    "register_start_journey_title": "Start your brow journey today",
    "register_start_journey_sub": "Join thousands exploring microblading styles and building their beauty businesses.",
    "role_consumer_desc": "I want to explore brow styles for myself",
    "role_consumer_detail": "Access the brow simulator and find listed providers near you.",
    "role_pro_desc": "I'm a licensed microblading professional",
    "role_pro_detail": "Manage client sessions, run consultations, and track your work.",
    "role_founder_desc": "I want to start a microblading business",
    "role_founder_detail": "Access startup guides, business resources, and industry insights.",
    "selected": "Selected",
    "your_name_placeholder": "Your name",
    "password_placeholder": "Min 8 characters",
    "show_password": "Show",
    "hide_password": "Hide",
    "registration_failed": "Registration failed. Please try again.",
    "sign_in_link": "Sign in",
    "viz_only_short": "Visualization platform only. Not a licensed medical or procedure provider."
}

AUTH_EXTRA_KO = {
    "register_step1_label": "역할 선택",
    "register_step2_label": "계정 정보",
    "register_personalize": "경험을 맞춤화하기 위해 본인을 알려주세요",
    "register_creating_account": "{role} 계정을 만들고 있습니다",
    "register_continue_as": "{role}으로 계속하기",
    "register_creating": "생성 중...",
    "register_start_journey_title": "오늘 눈썹 여정을 시작하세요",
    "register_start_journey_sub": "마이크로블레이딩 스타일을 탐색하고 뷰티 비즈니스를 구축하는 수천 명과 함께하세요.",
    "role_consumer_desc": "나를 위한 눈썹 스타일을 탐색하고 싶어요",
    "role_consumer_detail": "눈썹 시뮬레이터를 이용하고 근처 시술소를 찾아보세요.",
    "role_pro_desc": "저는 면허를 가진 마이크로블레이딩 전문가입니다",
    "role_pro_detail": "고객 세션 관리, 상담 진행, 작업 추적을 하세요.",
    "role_founder_desc": "마이크로블레이딩 사업을 시작하고 싶습니다",
    "role_founder_detail": "창업 가이드, 비즈니스 리소스, 업계 인사이트에 접근하세요.",
    "selected": "선택됨",
    "your_name_placeholder": "이름을 입력하세요",
    "password_placeholder": "최소 8자 이상",
    "show_password": "보기",
    "hide_password": "숨기기",
    "registration_failed": "회원가입에 실패했습니다. 다시 시도해주세요.",
    "sign_in_link": "로그인",
    "viz_only_short": "시각화 플랫폼 전용. 면허가 있는 의료 또는 시술 서비스 제공자가 아닙니다."
}

SIMULATE_EXTRA = {
    "subtitle_full": "Preview 12 styles on your own photo — free & instant",
    "reset": "Reset",
    "step_choose_style": "Choose Style",
    "step_upload_photo": "Upload Photo",
    "step_preview_result": "Preview Result",
    "viz_only_full": "Results are for illustration only. Not a guarantee of procedure outcomes. Always consult a licensed professional.",
    "choose_a_style": "Choose a Style",
    "upload_your_photo": "Upload Your Photo",
    "portrait_hint": "9:16 portrait",
    "consent_label": "I agree that this image will be processed by AI and used for simulation only.",
    "click_to_upload": "Click to upload",
    "portrait_tip": "Front-facing portrait works best",
    "change_photo": "Click to change photo",
    "select_style_first": "Select a style first",
    "upload_photo_first": "Upload your photo",
    "agree_first": "Agree to the consent above",
    "simulation_complete": "Simulation Complete",
    "try_another": "Try another",
    "before": "Before",
    "after": "After",
    "mock_note": "Mock simulation · Visualization only · Not a procedure guarantee",
    "save_to_crm": "Save to Client CRM",
    "open_clinic": "Open Clinic Dashboard",
    "saved_to_crm_title": "Saved to CRM",
    "sim_linked": "Simulation has been linked to the client record.",
    "view_in_clinic": "View in Clinic Dashboard",
    "client_name_label": "Client Name",
    "client_name_placeholder": "Client name (optional)",
    "notes_label": "Session Notes",
    "notes_placeholder": "Consultation notes, client preferences, skin condition...",
    "save_button": "Save to CRM",
    "saving": "Saving...",
    "failed_to_save": "Failed to save. Please sign in and try again.",
    "error_sign_in": "Simulation failed. Please try again.",
    "tip1": "Use a front-facing photo with good lighting for best results",
    "tip2": "Portrait orientation (9:16) works best for accurate simulation",
    "tip3": "Your photos are private and automatically deleted after 30 days"
}

SIMULATE_EXTRA_KO = {
    "subtitle_full": "12가지 스타일을 내 사진에서 미리보기 — 무료 & 즉시",
    "reset": "초기화",
    "step_choose_style": "스타일 선택",
    "step_upload_photo": "사진 업로드",
    "step_preview_result": "결과 미리보기",
    "viz_only_full": "결과는 예시용입니다. 실제 시술 결과를 보장하지 않습니다. 항상 면허가 있는 전문가와 상담하세요.",
    "choose_a_style": "스타일 선택",
    "upload_your_photo": "사진 업로드",
    "portrait_hint": "9:16 세로형",
    "consent_label": "이 이미지가 AI로 처리되며 시뮬레이션 목적으로만 사용됨에 동의합니다.",
    "click_to_upload": "클릭하여 업로드",
    "portrait_tip": "정면을 향한 세로형 사진이 가장 좋습니다",
    "change_photo": "클릭하여 사진 변경",
    "select_style_first": "먼저 스타일을 선택해주세요",
    "upload_photo_first": "사진을 업로드해주세요",
    "agree_first": "위의 동의에 체크해주세요",
    "simulation_complete": "시뮬레이션 완료",
    "try_another": "다른 스타일 시도",
    "before": "이전",
    "after": "이후",
    "mock_note": "모의 시뮬레이션 · 시각화 전용 · 시술 결과 보장 아님",
    "save_to_crm": "CRM에 저장",
    "open_clinic": "클리닉 대시보드 열기",
    "saved_to_crm_title": "CRM에 저장됨",
    "sim_linked": "시뮬레이션이 고객 기록에 연결되었습니다.",
    "view_in_clinic": "클리닉 대시보드에서 보기",
    "client_name_label": "고객 이름",
    "client_name_placeholder": "고객 이름 (선택 사항)",
    "notes_label": "세션 노트",
    "notes_placeholder": "상담 노트, 고객 선호도, 피부 상태...",
    "save_button": "CRM에 저장",
    "saving": "저장 중...",
    "failed_to_save": "저장에 실패했습니다. 로그인 후 다시 시도해주세요.",
    "error_sign_in": "시뮬레이션에 실패했습니다. 다시 시도해주세요.",
    "tip1": "최상의 결과를 위해 조명이 좋은 정면 사진을 사용하세요",
    "tip2": "정확한 시뮬레이션을 위해 세로형(9:16)이 가장 좋습니다",
    "tip3": "사진은 비공개이며 30일 후 자동으로 삭제됩니다"
}

PROVIDERS_EN = {
    "directory_label": "Directory",
    "title": "Find Listed Providers",
    "subtitle": "Discover listed microblading studios near you.",
    "disclaimer": "Seou-up does not certify providers. Always verify credentials before booking.",
    "listed": "listed",
    "verified": "verified",
    "loading": "Loading providers...",
    "no_providers_title": "No providers listed yet",
    "list_your_studio": "List Your Studio",
    "featured_badge": "Featured",
    "view_profile": "View Profile",
    "map_credit": "Map",
    "phone_label": "Phone",
    "website_label": "Website",
    "instagram_label": "Instagram",
    "verified_label": "Verified"
}

PROVIDERS_KO = {
    "directory_label": "디렉토리",
    "title": "시술소 찾기",
    "subtitle": "가까운 마이크로블레이딩 스튜디오를 찾아보세요.",
    "disclaimer": "Seou-up은 시술소를 인증하지 않습니다. 예약 전 항상 자격증을 확인하세요.",
    "listed": "등록됨",
    "verified": "인증됨",
    "loading": "시술소를 불러오는 중...",
    "no_providers_title": "아직 등록된 시술소가 없습니다",
    "list_your_studio": "내 스튜디오 등록하기",
    "featured_badge": "추천",
    "view_profile": "프로필 보기",
    "map_credit": "지도",
    "phone_label": "전화",
    "website_label": "웹사이트",
    "instagram_label": "인스타그램",
    "verified_label": "인증됨"
}

files = sorted(os.listdir(MESSAGES_DIR))
for fname in files:
    if not fname.endswith(".json"):
        continue
    locale = fname[:-5]
    path = os.path.join(MESSAGES_DIR, fname)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    is_ko = (locale == "ko")

    auth_new = AUTH_EXTRA_KO if is_ko else AUTH_EXTRA
    for k, v in auth_new.items():
        if k not in data.get("auth", {}):
            data.setdefault("auth", {})[k] = v

    sim_new = SIMULATE_EXTRA_KO if is_ko else SIMULATE_EXTRA
    for k, v in sim_new.items():
        if k not in data.get("simulate", {}):
            data.setdefault("simulate", {})[k] = v

    prov_new = PROVIDERS_KO if is_ko else PROVIDERS_EN
    if "providers" not in data:
        data["providers"] = {}
    for k, v in prov_new.items():
        if k not in data["providers"]:
            data["providers"][k] = v

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {fname}")

print("Done.")
