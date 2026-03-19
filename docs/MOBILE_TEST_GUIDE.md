# 📱 모바일 개인 테스트 설치 가이드

> Seou-up Microblading 앱을 개인 기기에서 테스트하는 방법입니다.

---

## 목차

- [방법 A: Expo Go (빠른 테스트)](#방법-a-expo-go-빠른-테스트)
- [방법 B: EAS APK 빌드 (독립 설치)](#방법-b-eas-apk-빌드-독립-설치)
- [백엔드 서버 연결 설정](#백엔드-서버-연결-설정)
- [자주 묻는 질문](#자주-묻는-질문)

---

## 방법 A: Expo Go (빠른 테스트)

> ✅ 장점: 설치 5분, APK 빌드 불필요  
> ⚠️ 조건: PC와 휴대폰이 **같은 WiFi**에 있어야 함, PC에서 서버 실행 중이어야 함

### 1단계 — Expo Go 앱 설치

| 플랫폼 | 설치 링크 |
|--------|-----------|
| 🤖 Android | [Google Play → Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| 🍎 iOS | [App Store → Expo Go](https://apps.apple.com/app/expo-go/id982107779) |

---

### 2단계 — 백엔드 서버 실행

프로젝트 루트에서:

```bash
docker compose up -d db api redis
```

> Docker Desktop이 없다면 [방법 B](#방법-b-eas-apk-빌드-독립-설치)를 사용하세요.

---

### 3단계 — PC의 로컬 IP 확인

**Windows:**
```
ipconfig
```
`IPv4 주소` 항목 확인 (예: `192.168.0.5`)

**macOS / Linux:**
```bash
ifconfig | grep "inet " | grep -v 127
```

---

### 4단계 — API URL 설정

`apps/mobile/.env` 파일 생성:

```bash
cd apps/mobile
cp .env.example .env
```

`.env` 파일 수정:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.5:8000
#                         ↑ 본인 PC의 로컬 IP로 변경
```

---

### 5단계 — Expo 개발 서버 실행

**Windows — 원클릭:**

`apps/mobile/start-mobile.bat` 더블클릭

> 로컬 IP 자동 감지 + `.env` 자동 업데이트 + Expo 서버 자동 시작

**수동 실행:**
```bash
cd apps/mobile
npm install
npx expo start --clear
```

---

### 6단계 — QR 코드로 앱 실행

터미널에 QR 코드가 출력됩니다.

| 플랫폼 | 스캔 방법 |
|--------|-----------|
| 🤖 Android | Expo Go 앱 열기 → `Scan QR code` |
| 🍎 iOS | 기본 카메라 앱으로 QR 코드 스캔 |

앱이 자동으로 빌드되어 휴대폰에서 실행됩니다. (첫 실행 30초~1분 소요)

---

### 방화벽 설정 (접속 안 될 때)

Windows 방화벽에서 포트 8000 허용:

```
Windows 검색 → "Windows Defender 방화벽"
→ 고급 설정 → 인바운드 규칙 → 새 규칙
→ 포트 → TCP → 특정 로컬 포트: 8000
→ 연결 허용 → 완료
```

---

## 방법 B: EAS APK 빌드 (독립 설치)

> ✅ 장점: PC 없이 어디서나 사용 가능, 일반 앱처럼 설치  
> ⚠️ 조건: [expo.dev](https://expo.dev) 무료 계정 필요, 빌드 시간 5~15분  
> 📱 Android만 지원 (iOS는 Apple Developer 계정 필요)

---

### 1단계 — Expo 계정 생성

https://expo.dev/signup 에서 무료 가입

---

### 2단계 — EAS CLI 설치 및 로그인

```bash
npm install -g eas-cli
eas login
```

이메일/비밀번호 입력 후 로그인 확인.

---

### 3단계 — 프로젝트 등록

```bash
cd apps/mobile
eas init
```

> "Would you like to create a project?" → **Yes**  
> 생성된 `projectId`가 `app.config.js`에 자동 저장됩니다.

---

### 4단계 — API 서버 주소 결정

| 시나리오 | API URL 예시 |
|----------|-------------|
| 같은 WiFi 내 테스트 | `http://192.168.0.5:8000` |
| 외부 접근 (ngrok 사용) | `https://xxxx.ngrok.io` |
| 클라우드 배포 후 | `https://api.your-domain.com` |

**ngrok으로 로컬 서버 외부 노출 (임시):**
```bash
# ngrok 설치: https://ngrok.com/download
ngrok http 8000
# → https://xxxx.ngrok.io 형태의 URL 발급
```

---

### 5단계 — eas.json에 API URL 설정

`apps/mobile/eas.json` → `preview` 프로필 수정:

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  },
  "env": {
    "EXPO_PUBLIC_API_URL": "http://192.168.0.5:8000"
  }
}
```

---

### 6단계 — APK 빌드

```bash
cd apps/mobile
eas build --platform android --profile preview
```

빌드 진행 상황은 터미널 또는 https://expo.dev/builds 에서 확인 가능.

완료 시 출력 예시:
```
✅ Build finished
🎉 Your build is ready!
APK: https://expo.dev/artifacts/eas/xxxx.apk
```

---

### 7단계 — APK 설치

**방법 1: 링크로 직접 설치**

1. 빌드 완료 후 발급된 APK URL을 휴대폰 브라우저에서 열기
2. 다운로드 → 설치

**방법 2: expo.dev 대시보드에서 QR 스캔**

1. https://expo.dev → 본인 프로젝트 → Builds
2. 최신 빌드 선택 → QR 코드로 APK 다운로드

---

### APK 설치 허용 설정 (Android)

APK 설치 전 설정이 필요할 수 있습니다:

```
설정 → 앱 → 특별한 앱 권한 → 알 수 없는 앱 설치
→ 브라우저/파일관리자 허용
```

---

## 백엔드 서버 연결 설정

### API URL 우선순위

앱은 다음 순서로 API 주소를 결정합니다:

```
1. EXPO_PUBLIC_API_URL 환경변수
2. eas.json env 설정값
3. 기본값: http://localhost:8000
```

### 환경별 설정

| 환경 | API URL 설정 |
|------|-------------|
| Expo Go (같은 WiFi) | `EXPO_PUBLIC_API_URL=http://[PC_IP]:8000` |
| EAS APK (같은 WiFi) | `eas.json` preview.env 수정 |
| 외부 서버 | 배포된 서버 URL |

---

## 기본 테스트 계정

시드 데이터에 포함된 기본 계정:

| 계정 | 이메일 | 비밀번호 | 역할 |
|------|--------|----------|------|
| 관리자 | `admin@seouup.dev` | `Admin1234!` | Admin |

새 계정은 회원가입 화면에서 직접 생성할 수 있습니다.

---

## 앱 주요 화면

| 화면 | 설명 |
|------|------|
| 홈 | 활성화된 플러그인 목록 |
| Brow Simulation | 눈썹 스타일 선택 → 사진 업로드 → AI 시뮬레이션 |
| Startup Guide | 마이크로블레이딩 창업 가이드 목록 |
| Providers | 인증 프로바이더 디렉토리 |
| Feedback | 피드백 제출 |
| Plugin Store | 플러그인 활성화/비활성화 |
| Settings | 프로필 · 언어 · 로그아웃 |

---

## 자주 묻는 질문

**Q. QR 스캔 후 "Network request failed" 에러**  
→ PC IP가 올바른지 확인. 같은 WiFi인지 확인. 방화벽 포트 8000 허용.

**Q. "Something went wrong" 화면**  
→ 백엔드 서버가 실행 중인지 확인: `http://[PC_IP]:8000/health`

**Q. 이미지 업로드 안 됨**  
→ Expo Go → 앱 권한 설정에서 카메라/사진 접근 허용.

**Q. EAS 빌드가 계속 실패함**  
→ `eas build --platform android --profile preview --clear-cache` 재시도.

**Q. iOS에서도 설치할 수 있나요?**  
→ Expo Go는 iOS도 지원합니다. 독립 APK 형태는 Android 전용이며,  
iOS 배포는 Apple Developer 계정($99/년)이 필요합니다.

---

*최종 업데이트: 2026년 3월*  
*레포지토리: https://github.com/jaeha81/Seou-up-Microblading-APP*
