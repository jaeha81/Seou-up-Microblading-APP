@echo off
chcp 65001 > nul
cls

echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║   Seou-up Microblading — Android APK 빌드    ║
echo  ╚═══════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: ─── 의존성 확인 ──────────────────────────────────────────
echo [준비] 환경 확인 중...
where eas >nul 2>&1 || (
    echo  EAS CLI 설치 중...
    call npm install -g eas-cli
)
if not exist "node_modules" (
    echo  npm install 실행 중...
    call npm install
)
echo  준비 완료.
echo.

:: ─── STEP 1: expo.dev 로그인 ──────────────────────────────
echo ┌─────────────────────────────────────────────────┐
echo │  STEP 1/4  expo.dev 로그인                     │
echo └─────────────────────────────────────────────────┘
echo.
for /f "tokens=*" %%i in ('eas whoami 2^>nul') do set EAS_USER=%%i
if defined EAS_USER (
    echo  이미 로그인됨: %EAS_USER%
) else (
    echo  expo.dev 계정으로 로그인하세요.
    echo  계정이 없다면 https://expo.dev/signup 에서 무료 가입
    echo.
    call eas login
    if errorlevel 1 (
        echo  [오류] 로그인 실패.
        pause & exit /b 1
    )
)
echo.

:: ─── STEP 2: 프로젝트 등록 ────────────────────────────────
echo ┌─────────────────────────────────────────────────┐
echo │  STEP 2/4  EAS 프로젝트 등록                   │
echo └─────────────────────────────────────────────────┘
echo.
eas project:info >nul 2>&1
if errorlevel 1 (
    echo  EAS 프로젝트를 등록합니다...
    call eas init
    if errorlevel 1 (
        echo  [오류] 프로젝트 등록 실패.
        pause & exit /b 1
    )
) else (
    echo  프로젝트 확인됨.
)
echo.

:: ─── STEP 3: API URL 설정 ─────────────────────────────────
echo ┌─────────────────────────────────────────────────┐
echo │  STEP 3/4  백엔드 API 주소 설정                │
echo └─────────────────────────────────────────────────┘
echo.
echo  현재 PC의 IP 주소:
ipconfig | findstr /i "IPv4" | findstr /v "169.254"
echo.
echo  [선택사항] 백엔드 API 주소를 입력하세요.
echo.
echo  ┌ 상황별 입력값 ──────────────────────────────────┐
echo  │ 같은 WiFi   →  http://192.168.x.x:8000         │
echo  │ ngrok 터널  →  https://xxxx.ngrok.io            │
echo  │ 배포 서버   →  https://api.myserver.com         │
echo  │ 건너뜀(엔터)→  나중에 eas.json에서 직접 수정    │
echo  └─────────────────────────────────────────────────┘
echo.
set /p USER_API_URL="  API 주소 입력: "
echo.

if not "%USER_API_URL%"=="" (
    echo  eas.json에 API URL 적용 중...
    powershell -NoProfile -Command ^
      "$j = Get-Content eas.json -Raw | ConvertFrom-Json; " ^
      "$j.build.preview.env.EXPO_PUBLIC_API_URL = '%USER_API_URL%'; " ^
      "$j | ConvertTo-Json -Depth 10 | Set-Content eas.json"
    echo  API URL 설정됨: %USER_API_URL%
) else (
    echo  기본값 사용 (로컬 에뮬레이터 10.0.2.2:8000)
)
echo.

:: ─── STEP 4: APK 빌드 ─────────────────────────────────────
echo ┌─────────────────────────────────────────────────┐
echo │  STEP 4/4  클라우드 APK 빌드 (5~15분 소요)    │
echo └─────────────────────────────────────────────────┘
echo.
echo  빌드가 Expo 클라우드 서버에서 실행됩니다.
echo  진행 상황 확인: https://expo.dev/builds
echo.

call eas build --platform android --profile preview --non-interactive
set BUILD_RESULT=%errorlevel%

echo.
echo ╔═══════════════════════════════════════════════════╗
if %BUILD_RESULT%==0 (
    echo ║  ✅ APK 빌드 성공!                              ║
    echo ║                                                 ║
    echo ║  APK 다운로드:                                  ║
    echo ║  → 위 출력에서 URL 복사                         ║
    echo ║  → 또는 https://expo.dev/builds 에서 확인       ║
    echo ║                                                 ║
    echo ║  Android 설치 방법:                             ║
    echo ║  1. 폰 브라우저에서 APK URL 열기                ║
    echo ║  2. 파일 탭 → 설치                              ║
    echo ║  3. "알 수 없는 앱 허용" → 확인                 ║
) else (
    echo ║  ❌ 빌드 실패                                   ║
    echo ║  위 오류 메시지를 확인하거나                    ║
    echo ║  https://expo.dev/builds 에서 상세 로그 확인    ║
)
echo ╚═══════════════════════════════════════════════════╝
echo.
pause
