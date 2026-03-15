# Compliance & Legal

## Platform Classification

Seou-up Microblading is classified as an **information and visualization support tool**.

| Category | Status |
|---------|--------|
| Medical device | ❌ Not applicable |
| Licensed procedure service | ❌ Not applicable |
| Cosmetic advice platform | ❌ Not applicable |
| Information & visualization tool | ✅ **This platform** |

## Required Compliance Elements

Every screen includes:

1. **ComplianceBanner** (`/apps/web/src/components/ComplianceBanner.tsx`)
   - Shown at top of every page
   - Dismissable by user but persistent in session

2. **Simulation Disclaimer**
   - Shown on `/simulate` page before and after simulation
   - States results are for visualization only

3. **Legal Consent** (onboarding)
   - Required on first login via `/onboarding`
   - Recorded in `users.legal_consent_accepted` + `legal_consent_at`

4. **Legal Page** (`/legal`)
   - Full text of all 5 compliance notices
   - Available in EN/KO/TH/VI

## The 5 Compliance Notices (Seeded)

| Key | Type | Description |
|-----|------|-------------|
| `platform_disclaimer` | Banner | Core platform disclaimer |
| `medical_disclaimer` | Banner | Contraindications list |
| `privacy_policy` | Footer | Data handling |
| `terms_of_service` | Modal | Usage terms |
| `photo_consent` | Inline | Photo upload consent |

## Simulation Adapter Disclaimer

Mock simulation output always includes:
```json
{
  "note": "Mock simulation result. This platform is for visualization purposes only. Not a licensed medical or procedure provider."
}
```

## Data Retention

- Uploaded photos: 30 days auto-delete
- Personal data: Available for deletion on request
- Simulation data: Stored per user, deletable
