"""clinic + pro_dashboard namespace 번역 키 추가"""
import json, os

MESSAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "messages")

CLINIC_EN = {
    "loading": "Loading clinic dashboard…",
    "sign_in": "Sign in",
    "portal_label": "B2B Dashboard",
    "portal_title": "Clinic Portal",
    "portal_subtitle": "Manage your studio team, AI simulations, and subscription — all in one place.",
    "no_clinic": "You have not registered a clinic yet.",
    "register_button": "Register Your Clinic",
    "already_pro": "Already on the Pro plan?",
    "view_pricing": "View pricing",
    "form_title": "Register Clinic",
    "field_name": "Clinic Name",
    "field_name_placeholder": "e.g. Seoul Beauty Studio",
    "field_city": "City",
    "field_city_placeholder": "Seoul",
    "field_country": "Country",
    "field_country_placeholder": "Korea",
    "field_phone": "Phone",
    "field_phone_placeholder": "+82 10-0000-0000",
    "field_website": "Website",
    "field_website_placeholder": "https://yourstudio.com",
    "creating": "Creating…",
    "create_button": "Create Clinic",
    "dashboard_label": "Clinic Dashboard",
    "section_subscription": "Subscription",
    "upgrade_to_pro": "Upgrade to Pro — $99/mo",
    "subscribe": "Subscribe — $49/mo",
    "redirecting": "Redirecting…",
    "staff_limit": "Staff limit",
    "unlimited": "Unlimited",
    "simulations": "Simulations",
    "per_month": "/mo",
    "renews": "Renews",
    "section_team": "Team",
    "remove": "Remove",
    "invite_title": "Invite Staff Member",
    "invite_placeholder": "staff@example.com",
    "role_staff": "Staff",
    "role_manager": "Manager",
    "invite_button": "Invite",
    "invite_basic_limit": "Basic plan: max 3 staff. Upgrade to Pro for unlimited.",
    "section_info": "Clinic Info",
    "info_phone": "Phone",
    "info_website": "Website",
    "info_slug": "Slug",
    "error_load": "Failed to load clinic data. Make sure you are logged in.",
    "error_create": "Failed to create clinic.",
    "error_invite": "Failed to invite member.",
    "error_remove": "Failed to remove member.",
    "error_checkout": "Checkout failed. Ensure Stripe is configured.",
    "plan_basic_label": "Basic Clinic",
    "plan_pro_label": "Pro Clinic",
    "status_trialing": "Trialing",
    "status_active": "Active",
    "status_past_due": "Past Due",
    "status_cancelled": "Cancelled",
}

CLINIC_KO = {
    "loading": "클리닉 대시보드를 불러오는 중…",
    "sign_in": "로그인",
    "portal_label": "B2B 대시보드",
    "portal_title": "클리닉 포털",
    "portal_subtitle": "스튜디오 팀, AI 시뮬레이션, 구독을 한 곳에서 관리하세요.",
    "no_clinic": "아직 클리닉을 등록하지 않으셨습니다.",
    "register_button": "클리닉 등록하기",
    "already_pro": "이미 Pro 플랜을 이용 중이신가요?",
    "view_pricing": "요금제 보기",
    "form_title": "클리닉 등록",
    "field_name": "클리닉 이름",
    "field_name_placeholder": "예: 서울 뷰티 스튜디오",
    "field_city": "도시",
    "field_city_placeholder": "서울",
    "field_country": "국가",
    "field_country_placeholder": "대한민국",
    "field_phone": "전화번호",
    "field_phone_placeholder": "+82 10-0000-0000",
    "field_website": "웹사이트",
    "field_website_placeholder": "https://yourstudio.com",
    "creating": "생성 중…",
    "create_button": "클리닉 만들기",
    "dashboard_label": "클리닉 대시보드",
    "section_subscription": "구독",
    "upgrade_to_pro": "Pro로 업그레이드 — $99/월",
    "subscribe": "구독하기 — $49/월",
    "redirecting": "리디렉션 중…",
    "staff_limit": "스태프 제한",
    "unlimited": "무제한",
    "simulations": "시뮬레이션",
    "per_month": "/월",
    "renews": "갱신일",
    "section_team": "팀",
    "remove": "제거",
    "invite_title": "스태프 초대",
    "invite_placeholder": "staff@example.com",
    "role_staff": "스태프",
    "role_manager": "매니저",
    "invite_button": "초대",
    "invite_basic_limit": "Basic 플랜: 스태프 최대 3명. Pro로 업그레이드하면 무제한.",
    "section_info": "클리닉 정보",
    "info_phone": "전화",
    "info_website": "웹사이트",
    "info_slug": "슬러그",
    "error_load": "클리닉 데이터를 불러오지 못했습니다. 로그인 여부를 확인하세요.",
    "error_create": "클리닉 생성에 실패했습니다.",
    "error_invite": "멤버 초대에 실패했습니다.",
    "error_remove": "멤버 제거에 실패했습니다.",
    "error_checkout": "결제에 실패했습니다. Stripe 설정을 확인하세요.",
    "plan_basic_label": "Basic 클리닉",
    "plan_pro_label": "Pro 클리닉",
    "status_trialing": "체험 중",
    "status_active": "활성",
    "status_past_due": "연체",
    "status_cancelled": "취소됨",
}

PRO_EN = {
    "badge": "Pro Clinic",
    "title": "Clinic Dashboard",
    "subtitle": "Manage consultations, track clients, and monitor your growth.",
    "upgrade_agency": "Upgrade to Agency",
    "new_session": "+ New Session",
    "disclaimer_title": "Professional Use Only",
    "disclaimer_body": "Sessions are for consultation visualization. Always hold valid local licenses before performing procedures.",
    "stat_total": "Total Sessions",
    "stat_total_sub": "All time",
    "stat_month": "This Month",
    "stat_completed": "Completed",
    "stat_completed_sub": "% completion rate",
    "stat_notes": "With Notes",
    "stat_notes_sub": "Sessions documented",
    "action_consultation": "New Consultation",
    "action_simulator": "Brow Simulator",
    "action_guides": "View Guides",
    "action_profile": "Manage Profile",
    "tab_sessions": "Recent Sessions",
    "tab_clients": "Clients",
    "loading_sessions": "Loading sessions…",
    "loading_clients": "Loading clients…",
    "no_sessions_title": "No sessions yet.",
    "no_sessions_cta": "Start your first session →",
    "showing_of": "Showing {shown} of {total} sessions",
    "client_col_client": "Client",
    "client_col_style": "Preferred Style",
    "client_col_sessions": "Sessions",
    "client_col_last": "Last Visit",
    "no_clients_title": "No clients tracked yet.",
    "no_clients_sub": "Start a session to automatically create client records.",
    "clients_footer": "Client records are derived from session data. Full CRM available on Agency plan.",
    "upgrade_label": "Upgrade",
    "upgrade_body": "Get unlimited consultations, full CRM, analytics & Featured badge on Agency plan.",
    "upgrade_cta": "See Plans →",
    "session_label": "Session",
}

PRO_KO = {
    "badge": "Pro 클리닉",
    "title": "클리닉 대시보드",
    "subtitle": "상담을 관리하고, 고객을 추적하며, 성장을 모니터링하세요.",
    "upgrade_agency": "에이전시로 업그레이드",
    "new_session": "+ 새 세션",
    "disclaimer_title": "전문가 전용",
    "disclaimer_body": "세션은 상담 시각화 목적입니다. 시술 전 반드시 유효한 현지 면허를 보유하세요.",
    "stat_total": "총 세션",
    "stat_total_sub": "전체 기간",
    "stat_month": "이번 달",
    "stat_completed": "완료됨",
    "stat_completed_sub": "% 완료율",
    "stat_notes": "노트 있음",
    "stat_notes_sub": "기록된 세션",
    "action_consultation": "새 상담",
    "action_simulator": "눈썹 시뮬레이터",
    "action_guides": "가이드 보기",
    "action_profile": "프로필 관리",
    "tab_sessions": "최근 세션",
    "tab_clients": "고객",
    "loading_sessions": "세션을 불러오는 중…",
    "loading_clients": "고객을 불러오는 중…",
    "no_sessions_title": "아직 세션이 없습니다.",
    "no_sessions_cta": "첫 세션 시작하기 →",
    "showing_of": "{shown}개 / 전체 {total}개 세션",
    "client_col_client": "고객",
    "client_col_style": "선호 스타일",
    "client_col_sessions": "세션 수",
    "client_col_last": "최근 방문",
    "no_clients_title": "아직 고객 기록이 없습니다.",
    "no_clients_sub": "세션을 시작하면 고객 기록이 자동으로 생성됩니다.",
    "clients_footer": "고객 기록은 세션 데이터에서 도출됩니다. 전체 CRM은 에이전시 플랜에서 사용 가능합니다.",
    "upgrade_label": "업그레이드",
    "upgrade_body": "에이전시 플랜으로 무제한 상담, 전체 CRM, 분석 및 Featured 배지를 이용하세요.",
    "upgrade_cta": "플랜 보기 →",
    "session_label": "세션",
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

    # clinic namespace
    clinic_new = CLINIC_KO if is_ko else CLINIC_EN
    if "clinic" not in data:
        data["clinic"] = {}
    for k, v in clinic_new.items():
        if k not in data["clinic"]:
            data["clinic"][k] = v

    # pro_dashboard namespace
    pro_new = PRO_KO if is_ko else PRO_EN
    if "pro_dashboard" not in data:
        data["pro_dashboard"] = {}
    for k, v in pro_new.items():
        if k not in data["pro_dashboard"]:
            data["pro_dashboard"][k] = v

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {fname}")

print("Done.")
