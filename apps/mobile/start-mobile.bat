@echo off
chcp 65001 > nul
echo.
echo ============================================
echo   Seou-up Microblading - Mobile Dev Start
echo ============================================
echo.

:: 로컬 IP 자동 감지
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "169.254" ^| head -1') do (
    set LOCAL_IP=%%i
)
set LOCAL_IP=%LOCAL_IP: =%

echo [INFO] 감지된 로컬 IP: %LOCAL_IP%
echo.

:: .env 파일 생성/업데이트
echo EXPO_PUBLIC_API_URL=http://%LOCAL_IP%:8000 > .env
echo [OK] .env 업데이트: http://%LOCAL_IP%:8000
echo.

:: node_modules 확인
if not exist "node_modules" (
    echo [설치중] npm install...
    npm install
)

echo.
echo ============================================
echo   휴대폰에서 접속하는 방법:
echo.
echo   1. Android/iOS App Store에서
echo      [Expo Go] 앱 설치
echo.
echo   2. PC와 폰이 같은 WiFi에 연결
echo.
echo   3. 아래 QR 코드를 Expo Go로 스캔
echo      또는 URL 직접 입력
echo.
echo   API 서버: http://%LOCAL_IP%:8000
echo ============================================
echo.
echo [시작] Expo 개발 서버 실행중...
echo.

npx expo start --clear

pause
