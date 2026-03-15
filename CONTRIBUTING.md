# Contributing to Seou-up Microblading

> ⚠️ **Disclaimer**: Seou-up Microblading is an information and visualization support platform only.
> Not a licensed medical or procedure provider.

## Getting Started

1. Fork the repository
2. Set up your local environment (see [docs/setup.md](./docs/setup.md))
3. Create a feature branch: `git checkout -b feat/your-feature-name`
4. Make your changes
5. Open a Pull Request

## Branch Naming

| Type | Example |
|------|---------|
| Feature | `feat/eyebrow-style-filtering` |
| Bug fix | `fix/simulation-upload-error` |
| Docs | `docs/api-reference-update` |
| Refactor | `refactor/auth-service` |

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add provider map integration
fix: correct alembic migration order
docs: update setup guide for Windows
refactor: extract simulation adapter factory
```

## Project Structure

```
apps/api/     → FastAPI backend
  models/     → SQLAlchemy ORM (15 tables)
  routers/    → Route handlers
  services/   → Business logic
  schemas/    → Pydantic models
  seeds/      → Initial data
  alembic/    → DB migrations

apps/web/     → Next.js 14 frontend
  src/app/[locale]/  → i18n screens (12 pages)
  src/components/    → Shared components
  src/messages/      → Translation files (en/ko/th/vi)
```

## Phase Roadmap

| Phase | Key Feature |
|-------|-------------|
| ✅ MVP | Mock simulation, Auth, Guide, Providers |
| Phase 4 | MediaPipe real AI overlay, Social login |
| Phase 5 | PDF export, Celery async |
| Phase 6 | Map integration, Partner accounts |

## Compliance Note

**All code contributions must maintain compliance requirements:**
- `ComplianceBanner` must remain on every page
- Simulation results must always include visualization disclaimer
- No medical claims in any user-facing copy

## Code Standards

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Strict mode enabled, no `any` types
- **Tests**: Add tests for new API endpoints
- **i18n**: Add translations for EN + KO at minimum for new strings
