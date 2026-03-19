# Seou-up Microblading 💄

> **⚠️ Disclaimer**: Seou-up Microblading is an information and visualization support platform only.
> Not a licensed medical or procedure provider. Always consult a certified professional before any procedure.

## 목차

- [개요](#개요)
- [기술 스택](#기술-스택)
- [실행 방법](#실행-방법)
- [📱 모바일 개인 테스트 가이드](./docs/MOBILE_TEST_GUIDE.md)
  - [방법 1: Docker (권장)](#방법-1-docker-권장)
  - [방법 2: 로컬 개발](#방법-2-로컬-개발)
  - [방법 3: Windows 원클릭](#방법-3-windows-원클릭)
- [환경 변수](#환경-변수)
- [소셜 로그인 설정](#소셜-로그인-설정)
- [API 엔드포인트](#api-엔드포인트)
- [화면 구조](#화면-구조)
- [모바일 앱 실행](#모바일-앱-실행)
- [개발 현황](#개발-현황)

---

## 개요

**Seou-up Microblading** — AI 기반 눈썹 시각화 플랫폼

| 기능 | 설명 |
|------|------|
| 🎨 **AI 브로우 시뮬레이터** | 12가지 눈썹 스타일을 본인 사진에 미리보기 (MediaPipe FaceMesh) |
| 🗂️ **스타트업 가이드** | 마이크로블레이딩 창업 전문 가이드 |
| 📍 **프로바이더 디렉토리** | 인증된 시술 전문가 찾기 |
| 👥 **멀티롤 인증** | Consumer · Pro · Founder · Admin |
| 🌍 **다국어** | EN · KO · TH · VI |
| 🔐 **소셜 로그인** | Google + Kakao OAuth2 |
| 📄 **PDF 리포트** | 시뮬레이션 결과 A4 PDF 다운로드 |

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · next-intl |
| **Backend** | FastAPI · Python 3.11 · Uvicorn |
| **Database** | PostgreSQL 15 · SQLAlchemy · Alembic |
| **Auth** | JWT · bcrypt · Google OAuth2 · Kakao OAuth |
| **AI** | MediaPipe FaceMesh (Mock 폴백 포함) |
| **Queue** | Celery · Redis |
| **PDF** | ReportLab |
| **Mobile** | React Native · Expo · Plugin Architecture |
| **Infra** | Docker · Docker Compose |

---

## 실행 방법

### 방법 1: Docker (권장)

> Docker Desktop이 설치 및 실행 중이어야 합니다.

**1단계 — 레포 클론**
```bash
git clone https://github.com/jaeha81/Seou-up-Microblading-APP.git
cd Seou-up-Microblading-APP
```

**2단계 — 환경 변수 설정**
```bash
cp apps/api/.env.example apps/api/.env
```
> 기본값으로 바로 실행 가능합니다. 소셜 로그인은 [소셜 로그인 설정](#소셜-로그인-설정) 참고.

**3단계 — 실행**
```bash
docker compose up --build
```

컨테이너가 올라오면 자동으로:
- ✅ PostgreSQL 데이터베이스 초기화
- ✅ Alembic 마이그레이션 실행 (테이블 15개 생성)
- ✅ 시드 데이터 입력 (눈썹 스타일 12개 · 가이드 5개 · 프로바이더 5개)
- ✅ API 서버 시작
- ✅ Next.js 웹 빌드 및 시작
- ✅ Celery Worker 시작

**접속**

| 서비스 | URL |
|--------|-----|
| 🌐 웹 앱 | http://localhost:3000 |
| 📖 API 문서 (Swagger) | http://localhost:8000/docs |
| 🔍 API 헬스 체크 | http://localhost:8000/health |

**종료**
```bash
docker compose down
```

**데이터 포함 완전 초기화**
```bash
docker compose down -v
```

---

### 방법 2: 로컬 개발

> Python 3.11, Node.js 18+, PostgreSQL 15 필요

**1단계 — DB 생성**
```bash
psql -U postgres -c "CREATE DATABASE seou_up_db;"
```

**2단계 — 백엔드 설정**
```bash
cd apps/api
cp .env.example .env
# .env 파일에서 DATABASE_URL을 localhost로 수정:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/seou_up_db

python3.11 -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
alembic upgrade head
python seeds/run_seeds.py
uvicorn main:app --reload --port 8000
```

**3단계 — 프론트엔드 설정**
```bash
cd apps/web
npm install
npm run dev
```

접속: http://localhost:3000

---

### 방법 3: Windows 원클릭

프로젝트 루트의 `start-dev.bat`을 **더블클릭**합니다.

- Docker로 DB + Redis만 시작
- Python 3.11 venv 자동 생성 + 의존성 설치
- 마이그레이션 + 시드 자동 실행
- API 서버 + 웹 서버 각각 새 터미널에서 시작

> ⚠️ Python 3.11이 별도 설치되어 있어야 합니다.

---

## 환경 변수

`apps/api/.env` 파일 설정 (`.env.example` 복사 후 수정):

```env
# 데이터베이스
DATABASE_URL=postgresql://postgres:password@db:5432/seou_up_db
# 로컬 개발 시: @localhost:5432/seou_up_db

# JWT 보안키 (운영 시 반드시 변경)
JWT_SECRET_KEY=your-long-random-secret-key-here

# AI 어댑터
# "mock"     → 즉시 결과 (기본값, 별도 설치 불필요)
# "mediapipe" → 실제 AI (pip install mediapipe opencv-python-headless 필요)
SIMULATION_ADAPTER=mock

# Redis (Celery 큐)
REDIS_URL=redis://redis:6379/0
# 로컬: redis://localhost:6379/0

# OAuth (소셜 로그인 — 선택사항)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/en/auth/google-callback
KAKAO_CLIENT_ID=
KAKAO_REDIRECT_URI=http://localhost:3000/en/auth/kakao-callback
```

---

## 소셜 로그인 설정

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → API 및 서비스 → 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가:
   ```
   http://localhost:3000/en/auth/google-callback
   ```
4. `.env`에 입력:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/) → 내 애플리케이션 → 앱 추가
2. 플랫폼 → Web → 사이트 도메인: `http://localhost:3000`
3. 카카오 로그인 활성화 → Redirect URI 추가:
   ```
   http://localhost:3000/en/auth/kakao-callback
   ```
4. `.env`에 입력:
   ```env
   KAKAO_CLIENT_ID=your_rest_api_key
   ```

---

## AI 시뮬레이션 모드 변경

### Mock 모드 (기본값)
```env
SIMULATION_ADAPTER=mock
```
별도 설치 없이 즉시 동작합니다.

### MediaPipe 실제 AI 모드
```bash
# 가상환경 활성화 후
pip install mediapipe>=0.10.0 opencv-python-headless>=4.9.0
```
```env
SIMULATION_ADAPTER=mediapipe
```
> MediaPipe 미설치 시 자동으로 Mock 모드로 폴백됩니다.

---

## API 엔드포인트

Swagger UI: **http://localhost:8000/docs**

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/auth/register` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 → JWT 반환 |
| `GET` | `/api/auth/me` | 내 정보 |
| `GET` | `/api/auth/google` | Google OAuth URL |
| `POST` | `/api/auth/google/callback` | Google 코드 → JWT |
| `GET` | `/api/auth/kakao` | Kakao OAuth URL |
| `POST` | `/api/auth/kakao/callback` | Kakao 코드 → JWT |
| `GET` | `/api/eyebrow-styles` | 눈썹 스타일 목록 |
| `POST` | `/api/simulations` | 시뮬레이션 생성 |
| `POST` | `/api/simulations/{id}/upload` | 사진 업로드 + AI 처리 |
| `GET` | `/api/simulations` | 내 시뮬레이션 목록 |
| `POST` | `/api/export/simulation/{id}/pdf` | PDF 리포트 다운로드 |
| `GET` | `/api/guides` | 가이드 목록 |
| `GET` | `/api/providers` | 프로바이더 목록 |
| `POST` | `/api/providers` | 스튜디오 등록 (인증 필요) |
| `POST` | `/api/feedback` | 피드백 제출 |
| `GET` | `/api/admin/stats` | 통계 (Admin만) |
| `GET` | `/api/health` | 헬스 체크 |

---

## 화면 구조

| URL | 접근 권한 | 설명 |
|-----|-----------|------|
| `/en` | 전체 | 랜딩 페이지 |
| `/en/simulate` | 전체 | **핵심** — AI 브로우 시뮬레이터 |
| `/en/guide` | 전체 | 스타트업 가이드 목록 |
| `/en/guide/[slug]` | 전체 | 가이드 상세 |
| `/en/providers` | 전체 | 프로바이더 디렉토리 |
| `/en/providers/[id]` | 전체 | 프로바이더 상세 |
| `/en/auth/register` | 비로그인 | 회원가입 (역할 선택) |
| `/en/auth/login` | 비로그인 | 로그인 (Google · Kakao 포함) |
| `/en/auth/google-callback` | — | Google OAuth 콜백 |
| `/en/auth/kakao-callback` | — | Kakao OAuth 콜백 |
| `/en/onboarding` | 신규 가입자 | 온보딩 + 법적 동의 |
| `/en/profile` | 로그인 | 프로필 · 언어 설정 · 시뮬레이션 이력 |
| `/en/pro/dashboard` | Pro/Admin | Pro 컨설테이션 대시보드 |
| `/en/pro/session` | Pro/Admin | 클라이언트 세션 관리 |
| `/en/admin` | Admin | 관리자 패널 |
| `/en/feedback` | 전체 | 피드백 제출 |
| `/en/legal` | 전체 | 법적 고지 |

> `/en` 을 `/ko`, `/th`, `/vi` 로 변경하면 해당 언어로 전환됩니다.

---

## 모바일 앱 실행

```bash
cd apps/mobile
npm install
npx expo start
```

- iOS: Expo Go 앱 → QR 코드 스캔
- Android: Expo Go 앱 → QR 코드 스캔
- 시뮬레이터: `i` (iOS) / `a` (Android)

**포함된 플러그인 스크린:**
- Brow Simulation (카메라 권한 필요)
- Startup Guide
- Provider Directory
- Feedback
- Admin Panel (Admin 계정 전용)

> 📖 **상세 설치 가이드** → [docs/MOBILE_TEST_GUIDE.md](./docs/MOBILE_TEST_GUIDE.md)

---

## 기본 계정

시드 데이터에 포함된 관리자 계정:

| 항목 | 값 |
|------|-----|
| 이메일 | `admin@seouup.dev` |
| 비밀번호 | `Admin1234!` |
| 역할 | Admin |

---

## 개발 현황

| 항목 | 상태 |
|------|------|
| **진행률** | `████████████████████` **92%** |
| **빌드** | ✅ 18 routes · 0 errors |
| **레포** | https://github.com/jaeha81/Seou-up-Microblading-APP |

### ✅ 완료된 기능

| 레이어 | 항목 |
|--------|------|
| Backend | FastAPI 9개 라우터 · DB 15개 테이블 · JWT 인증 |
| Backend | Real AI (MediaPipe FaceMesh) eyebrow overlay |
| Backend | Google + Kakao OAuth2 소셜 로그인 |
| Backend | PDF Export (ReportLab A4 리포트) |
| Backend | Celery + Redis 비동기 시뮬레이션 큐 |
| Frontend | 18개 라우트 전체 UI/UX 완성 (EN/KO/TH/VI) |
| Frontend | 소셜 로그인 콜백 페이지 |
| Mobile | React Native/Expo + 플러그인 스크린 13개 |
| Infra | Docker Compose 5서비스 (자동 마이그레이션) |

### 🔜 잔여 (8%)
- Phase 6: Kakao/Google Maps 지도 연동
- Phase 6: 파트너 유료 플랜
- E2E 테스트 작성

---

## 라이선스

MIT License — 시각화 및 정보 제공 목적으로만 사용하세요.

*Seou-up Microblading is an information and visualization support platform only. Not a licensed medical or procedure provider.*
