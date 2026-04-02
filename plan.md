# Plan: Seou-up 100% 완성 (Phase 6 + E2E + 미구현 페이지)

## 0. CPS 요약

- **Context**: 프로젝트 92% 완성. 지도, 유료플랜, E2E 테스트, 가이드 상세페이지 미구현
- **Problem**: 실제 사용자가 프로바이더 위치를 지도로 확인 불가, Pro 유료기능 없음, 테스트 부재
- **Solution**: Leaflet 지도, Stripe 결제, Playwright E2E, 가이드 상세페이지 구현

---

## Phase 6-1: 프로바이더 지도 연동

**기술 선택**: Leaflet + react-leaflet (무료, API키 불필요, OpenStreetMap 타일)

### 변경 파일
| 파일 | 작업 |
|------|------|
| `apps/web/package.json` | react-leaflet, leaflet, @types/leaflet 추가 |
| `apps/web/src/components/ProviderMap.tsx` | **신규** — 지도 컴포넌트 (마커+팝업) |
| `apps/web/src/app/[locale]/providers/page.tsx` | 지도 뷰 탭 추가 |
| `apps/web/src/app/[locale]/providers/[id]/page.tsx` | 개별 위치 지도 추가 |
| `apps/api/seeds/seed_providers.py` | 서울 시술소 lat/lng 좌표 추가 |
| `apps/web/src/messages/*.json` | 지도 관련 i18n 키 추가 |

### 구현 상세
- ProviderMap: dynamic import (SSR 비활성화, Leaflet은 window 필요)
- 마커 클릭 시 프로바이더 정보 팝업
- providers 목록 페이지: 리스트/지도 뷰 토글
- provider 상세: 주소 아래 미니맵 표시

---

## Phase 6-2: 파트너 유료 플랜

**기술 선택**: Stripe Checkout (테스트 키 기본, 실 결제 전환 가능)

### DB 변경
| 테이블 | 변경 |
|--------|------|
| `subscriptions` | **신규** — provider_id, plan_type, stripe_subscription_id, status, period |

### 변경 파일
| 파일 | 작업 |
|------|------|
| `apps/api/models/subscription.py` | **신규** — Subscription 모델 |
| `apps/api/schemas/subscription.py` | **신규** — Pydantic 스키마 |
| `apps/api/routers/subscriptions.py` | **신규** — 결제/구독 API |
| `apps/api/core/config.py` | Stripe 환경변수 추가 |
| `apps/api/requirements.txt` | stripe 패키지 추가 |
| `apps/api/main.py` | subscriptions 라우터 등록 |
| `alembic/versions/003_add_subscriptions.py` | **신규** — 마이그레이션 |
| `apps/web/src/app/[locale]/pricing/page.tsx` | **신규** — 요금제 페이지 |
| `apps/web/src/app/[locale]/providers/page.tsx` | Featured 프로바이더 상단 표시 |
| `apps/web/src/messages/*.json` | 요금제 i18n 키 추가 |

### 요금제 구조
| Plan | 가격 | 기능 |
|------|------|------|
| Free | $0 | 기본 프로바이더 등록, 프로필 |
| Premium | $29/월 | Featured 배지, 상단 노출, 분석 리포트, 우선 지원 |

### API 엔드포인트
```
GET    /api/subscriptions/plans        → 요금제 목록
POST   /api/subscriptions/checkout     → Stripe Checkout 세션 생성
POST   /api/subscriptions/webhook      → Stripe 웹훅 (결제 확인)
GET    /api/subscriptions/my           → 내 구독 상태
POST   /api/subscriptions/cancel       → 구독 취소
```

---

## Phase 6-3: E2E 테스트 (Playwright)

### 변경 파일
| 파일 | 작업 |
|------|------|
| `apps/web/package.json` | @playwright/test 추가 |
| `apps/web/playwright.config.ts` | **신규** — Playwright 설정 |
| `apps/web/e2e/landing.spec.ts` | **신규** — 랜딩페이지 테스트 |
| `apps/web/e2e/auth.spec.ts` | **신규** — 로그인/회원가입 테스트 |
| `apps/web/e2e/simulate.spec.ts` | **신규** — 시뮬레이터 플로우 |
| `apps/web/e2e/providers.spec.ts` | **신규** — 프로바이더 목록/상세 |
| `apps/web/e2e/guide.spec.ts` | **신규** — 가이드 목록/상세 |

### 테스트 범위
- 페이지 로드 & 네비게이션
- 언어 전환 (EN ↔ KO)
- 로그인/회원가입 폼 검증
- 시뮬레이터 스타일 선택 → 업로드 플로우
- 프로바이더 목록/지도 뷰/상세

---

## 추가: 가이드 상세 페이지

### 변경 파일
| 파일 | 작업 |
|------|------|
| `apps/web/src/app/[locale]/guide/[slug]/page.tsx` | **구현** — 가이드 상세 페이지 |

---

## 이밸류에이션 체크리스트

### 설계 검증
- [x] CPS의 Problem을 이 Plan이 실제로 해결하는가?
- [x] 도메인 모델 간 관계가 정합적인가?
- [x] 기존 코드와 충돌하는 부분이 없는가?
- [x] 중복 로직이 새로 생기지 않는가?

### 구현 검증
- [x] 기존 레이어 구조(Router→Service→Model)를 따르는가?
- [x] ORM/마이그레이션 규칙이 반영되었는가?
- [x] 타입 안전성이 확보되었는가?
- [x] 에러 핸들링 전략이 명시되었는가?

### 유지보수 검증
- [x] 다른 개발자가 이 Plan만 보고 구현할 수 있는가?
- [x] 파일명/네이밍이 프로젝트 컨벤션과 일치하는가?
- [x] 테스트 전략이 포함되었는가?

### 판정: 전체 통과 → 구현 가능

---

계획이 완료되었습니다. 검토 후 메모를 남겨주시거나 구현 승인을 해주세요.
아직 코드를 수정하지는 않았습니다.
