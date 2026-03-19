# Seou-up Microblading — Mobile App (APK)

React Native (Expo) 기반 Android APK. 플러그인 아키텍처로 필요한 기능만 켜고 쓸 수 있습니다.

---

## 구조

```
apps/mobile/          ← 메인 앱 (React Native + Expo)
plugins/
  plugin-simulate/    ← AI 눈썹 시뮬레이션 (기본 활성)
  plugin-guide/       ← 창업 가이드
  plugin-providers/   ← 시술소 찾기
  plugin-feedback/    ← 피드백
  plugin-admin/       ← 관리자 대시보드
plugin-registry.json  ← GitHub 호스팅 플러그인 목록
```

---

## APK 빌드 방법

### 방법 1: EAS Build (권장 — 로컬 Android SDK 불필요)

```bash
# 1. 전제 조건
npm install -g eas-cli
expo login      # expo.dev 계정 필요

# 2. 의존성 설치
cd apps/mobile
npm install

# 3. 클라우드 APK 빌드 (내부 배포용)
eas build -p android --profile preview

# 4. 완료 후 다운로드 링크가 출력됩니다
```

### 방법 2: 로컬 빌드 (Android Studio 필요)

```bash
# 전제 조건: Android Studio + JDK 17 + ANDROID_HOME 환경변수 설정

cd apps/mobile
npm install

# Android 프로젝트 생성
npx expo prebuild --platform android

# APK 빌드
cd android
./gradlew assembleRelease

# APK 위치: android/app/build/outputs/apk/release/app-release.apk
```

### 방법 3: 개발용 빌드 (디바이스 연결)

```bash
cd apps/mobile
npm install
npm run android   # 연결된 디바이스 또는 에뮬레이터에 설치
```

---

## 백엔드 설정

앱이 연결할 API 서버 주소를 `apps/mobile/app.json`에서 수정:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-server.com"
    }
  }
}
```

로컬 개발 시 Android 에뮬레이터에서 `localhost` 대신 `10.0.2.2` 사용:

```json
"apiBaseUrl": "http://10.0.2.2:8000"
```

---

## 플러그인 시스템

### 플러그인 활성화 방법

앱 실행 후 하단 탭 **Plugins** → 원하는 플러그인 ON/OFF

### 기본 활성 플러그인

| 플러그인 | 기본값 | 역할 |
|---------|--------|------|
| Brow Simulation | ON | 모든 사용자 |
| Startup Guide | OFF | Founder |
| Find Providers | OFF | Consumer |
| Feedback | OFF | 모든 사용자 |
| Admin Dashboard | OFF | Admin |

### 새 플러그인 추가 방법 (개발자)

1. `plugins/plugin-{name}/` 디렉토리 생성
2. `SeouPlugin` 인터페이스 구현 (`apps/mobile/src/core/plugins/PluginInterface.ts` 참고)
3. `apps/mobile/App.tsx`의 `ALL_PLUGINS` 배열에 추가
4. `plugin-registry.json`에 메타데이터 등록
5. GitHub에 Push

---

## 성능 설계 원칙

| 원칙 | 구현 |
|------|------|
| 불필요한 이미지/애니메이션 배제 | 눈썹 스타일을 컬러 블록으로 표시, 애니메이션 최소화 |
| 필요 데이터만 비동기 + 캐시 | CacheService TTL (단기 5분 / 중기 15분 / 장기 60분) |
| 스켈레톤 UI + 프리패칭 | SkeletonBox/Card/Grid + CacheService.prefetch() |
| 전송 데이터 최소화 | 비필수 라이브러리 미포함, Zustand 경량 상태관리 |
| 비동기 핵심 기능 분리 | 플러그인별 lazy init, stale-while-revalidate 패턴 |

---

## 의존성 (핵심만)

```
expo ~51.0.28
react-native 0.74.5
@react-navigation/native ^6.1.17
axios ^1.7.2
zustand ^4.5.4
@react-native-async-storage/async-storage 1.23.1
expo-secure-store ~13.0.2
expo-image-picker ~15.0.7
i18next ^23.11.5
```

> Redux, Moment.js, Lodash, 무거운 차트 라이브러리 미사용
