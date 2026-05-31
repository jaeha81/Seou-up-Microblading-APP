# Seou-up Microblading APP — Codex Context

> 글로벌 지침: `~/.Codex/AGENTS.md` 전역 적용
> 워크플로우: research.md → plan.md → 승인 → 구현

## 프로젝트 개요

시술 정보·시각화 지원 플랫폼 (마이크로블레이딩 특화)
의료 행위 제공자 아님 — 정보 및 시각화 목적

## 기술 스택

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Mobile**: React Native / Capacitor (모바일 지원)
- **Backend**: API 레이어 (Docker Compose 기반)
- **Infra**: Docker + docker-compose

## 현재 상태 (2026-04-27)

- 진행도: 40%
- 마지막 push: 38일 전 (정체 상태)
- plan.md 존재 — 이전 계획 확인 후 이어서 진행

## 재개 시 실행 순서

1. `plan.md` 읽기 → 마지막 완료 지점 파악
2. `wiki/known-issues.md` 확인 (없으면 생성)
3. 다음 마일스톤 식별 → 구현 시작

## 주요 경로

- 앱: `apps/`
- 플러그인: `plugins/`
- 문서: `docs/`

## 금지 사항

- 의료 정보를 사실처럼 제공 금지
- 라이선스 없는 시술 관련 코드 자동 생성 금지
