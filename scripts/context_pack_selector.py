"""
context_pack_selector.py — Seou-up Microblading APP Bucky 컨텍스트 팩 선택기

사용법:
  python -X utf8 scripts/context_pack_selector.py "<요청 텍스트>"
  python -X utf8 scripts/context_pack_selector.py --packet "<요청 텍스트>"
  python -X utf8 scripts/context_pack_selector.py --packet --project seou-up "<요청 텍스트>"

역할:
  요청 텍스트를 분석해 관련 Context Pack 파일 경로와 내용을 출력한다.
  Claude Code는 이 출력을 읽고 작업을 시작한다.
"""

import sys
import os
import re

VAULT_BASE = r"C:\Users\user1\Documents\Obsidian Vault"
PROJECT_DIR = os.path.join(VAULT_BASE, "01_Projects", "seou-up-microblading")
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 키워드 → 관련 파일 매핑 ───────────────────────────────────────────────────
CONTEXT_MAP = {
    "번역|i18n|locale|언어|translation|messages": {
        "label": "i18n 번역 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_DIR, "PROJECT_MEMORY.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "messages", "en.json"),
        ],
        "instructions": """
## 번역 작업 시 필수 체크
1. scripts/add_translations.py 패턴으로 18개 언어 파일 동시 업데이트
2. KO는 한국어 번역, 나머지 16개는 영어 폴백
3. 페이지에서 useTranslations("[namespace]") 사용
4. common namespace 키(back/cancel/save)는 tCommon 별도 선언
5. ROLES 배열 등 t() 사용 객체는 컴포넌트 내부에서 초기화
""",
    },
    "시뮬레이터|simulate|brow|눈썹": {
        "label": "시뮬레이터 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "simulate", "page.tsx"),
        ],
        "instructions": """
## 시뮬레이터 주의사항
- 12개 스타일은 FALLBACK_STYLES에 정의됨
- 사진 업로드 → POST /api/simulations → POST /api/simulations/{id}/upload
- agreeConsent 체크박스 없으면 업로드/실행 불가
- result 이미지 onError 핸들러 필수 (fallback = preview)
""",
    },
    "providers|시술소|디렉토리|directory|map|지도": {
        "label": "시술소 디렉토리 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "providers", "page.tsx"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "components", "ProviderMap.tsx"),
        ],
        "instructions": """
## Providers/Map 주의사항
- Leaflet은 반드시 dynamic(..., { ssr: false }) 적용
- Provider.plan: DB는 "free"/"featured", 프론트 표시는 "paid_plan" 비교
- sorted: paid_plan이 상단 정렬
""",
    },
    "결제|stripe|pricing|요금|subscription": {
        "label": "Stripe 결제 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "api", "routers", "subscriptions.py"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "pricing", "page.tsx"),
        ],
        "instructions": """
## Stripe 주의사항
- STRIPE_SECRET_KEY는 _get_stripe() 지연 초기화 패턴 사용
- Webhook 서명 검증: stripe.webhook.construct_event()
- Provider.plan 업데이트는 webhook에서만 (checkout.session.completed)
- Billing Portal: /api/subscriptions/portal
""",
    },
    "clinic|crm|대시보드|dashboard|pro": {
        "label": "Clinic CRM / Pro Dashboard 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "clinic", "page.tsx"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "pro", "dashboard", "page.tsx"),
        ],
        "instructions": """
## Clinic CRM 주의사항
- 로그인 필요 (JWT 토큰 localStorage)
- 세션 노트: PATCH /api/simulations/{id}/note
- 다음 작업: 이 페이지들 i18n 적용
""",
    },
    "auth|login|register|회원|로그인": {
        "label": "인증 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "auth", "login", "page.tsx"),
            os.path.join(PROJECT_ROOT, "apps", "web", "src", "app", "[locale]", "auth", "register", "page.tsx"),
        ],
        "instructions": """
## Auth 주의사항
- JWT 토큰: localStorage.setItem("token", ...)
- register: 2단계 폼 (역할 선택 → 계정 정보)
- role 값: "consumer" | "pro" | "founder"
""",
    },
    "db|database|alembic|migration|postgres|postgresql": {
        "label": "DB / 마이그레이션 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "api", ".env.example"),
            os.path.join(PROJECT_ROOT, "apps", "api", "alembic", "versions"),
        ],
        "instructions": """
## DB 주의사항
- 마이그레이션 체인: 001 → 002 → 003 → 004 (subscriptions)
- 실행: cd apps/api && alembic upgrade head
- Provider seed: python apps/api/seeds/seed_providers.py
- .env 파일에 DATABASE_URL 설정 필요
""",
    },
    "pwa|mobile|모바일|앱|manifest": {
        "label": "PWA / 모바일 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "public", "manifest.json"),
        ],
        "instructions": """
## PWA 주의사항
- next.config.js의 withPWA: 프로덕션 빌드에서만 활성화
- 아이콘: public/icons/ 에 8종 (72~512px)
- 설치 유도 팝업은 useEffect + beforeinstallprompt 이벤트
""",
    },
    "test|playwright|e2e|테스트": {
        "label": "E2E 테스트 작업",
        "files": [
            os.path.join(PROJECT_DIR, "bucky-packet.md"),
            os.path.join(PROJECT_ROOT, "apps", "web", "e2e"),
        ],
        "instructions": """
## E2E 테스트 주의사항
- spec 파일: landing, auth, providers, guide, pricing, simulate
- 실행: cd apps/web && npx playwright test
- DB 연결 없이 일부 테스트 실패 가능
""",
    },
}

DEFAULT_PACK = {
    "label": "일반 작업",
    "files": [
        os.path.join(PROJECT_DIR, "bucky-packet.md"),
        os.path.join(PROJECT_DIR, "PROJECT_MEMORY.md"),
    ],
    "instructions": "PROJECT_MEMORY.md의 §6 블로킹 이슈와 §7 다음 작업 체크리스트를 확인하세요.",
}


def select_packs(request_text: str) -> list[dict]:
    text_lower = request_text.lower()
    matched = []
    for pattern, pack in CONTEXT_MAP.items():
        if re.search(pattern, text_lower):
            matched.append(pack)
    return matched if matched else [DEFAULT_PACK]


def print_pack(pack: dict, show_content: bool = False):
    print(f"\n{'='*60}")
    print(f"📦 Context Pack: {pack['label']}")
    print(f"{'='*60}")
    print("\n📁 관련 파일:")
    for f in pack["files"]:
        exists = "✅" if os.path.exists(f) else "⚠️ (없음)"
        print(f"  {exists} {f}")
    print(f"\n📋 작업 지침:{pack['instructions']}")

    if show_content:
        for f in pack["files"]:
            if os.path.isfile(f):
                print(f"\n{'─'*40}")
                print(f"# {os.path.basename(f)}")
                print('─'*40)
                try:
                    with open(f, "r", encoding="utf-8") as fh:
                        print(fh.read())
                except Exception as e:
                    print(f"[읽기 오류: {e}]")


def main():
    args = sys.argv[1:]
    show_content = "--packet" in args
    args = [a for a in args if not a.startswith("--")]

    if not args:
        print("사용법: python -X utf8 scripts/context_pack_selector.py [--packet] \"<요청 텍스트>\"")
        sys.exit(1)

    request = " ".join(args)
    packs = select_packs(request)

    print(f"\n🔍 요청: {request}")
    print(f"📦 선택된 패킷: {len(packs)}개\n")

    for pack in packs:
        print_pack(pack, show_content=show_content)

    print(f"\n{'='*60}")
    print("💡 Claude Code: 위 파일들을 읽은 후 작업을 시작하세요.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
