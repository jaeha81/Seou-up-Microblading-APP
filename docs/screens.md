# Screen Structure

## URL Map

| URL | Target Role | Screen |
|-----|-------------|--------|
| `/en` | All | Landing page |
| `/en/simulate` | All (Core) | Consumer brow simulation |
| `/en/auth/register` | All | Registration with role selection |
| `/en/auth/login` | All | Login |
| `/en/onboarding` | All | First-time onboarding + legal consent |
| `/en/pro/dashboard` | Pro | Consultation dashboard |
| `/en/pro/session` | Pro | Client simulation session |
| `/en/guide` | Founder | Startup guide home |
| `/en/providers` | Consumer | Find clinics |
| `/en/feedback` | All | Feedback submission |
| `/en/legal` | All | Legal notices |
| `/en/profile` | Logged in | Profile & language settings |
| `/en/admin` | Admin | Admin dashboard |

Replace `/en/` with `/ko/`, `/th/`, `/vi/` for other languages.

## Screen Details

### `/en` — Landing Page
- Hero section with CTA buttons
- Feature cards: Simulator, Guide, Providers
- Legal footer

### `/en/simulate` — Brow Simulator (Core Feature)
- 12 eyebrow style selector (grid)
- Photo upload with preview
- Run simulation button
- Result display with disclaimer

### `/en/auth/register` — Registration
- Step 1: Role selection (Consumer / Pro / Founder)
- Step 2: Email + password form
- Redirects to `/onboarding` after success

### `/en/onboarding` — First-time Onboarding
- Step 1: Welcome
- Step 2: Platform info
- Step 3: Legal consent (required checkbox)
- Step 4: Language selection

### `/en/pro/dashboard` — Pro Dashboard
- Session statistics
- Session list with status badges
- Create new session button

### `/en/pro/session` — Client Session
- Client name input
- Style recommendation selector
- Session notes textarea
- Creates simulation record

### `/en/guide` — Startup Guide
- List of 5 guide articles
- Category filter (startup / technique / marketing)
- Article cards with read button

### `/en/providers` — Find Providers
- Provider listing grid
- Disclaimer about independent verification
- Empty state with CTA to register

### `/en/feedback` — Feedback
- Category selector (General / Bug / Feature)
- Star rating
- Message textarea
- Optional email
- Anonymous submission supported

### `/en/legal` — Legal Notices
- All 5 compliance notices rendered
- Available in current locale

### `/en/profile` — Profile
- User info display
- Language switcher (EN/KO/TH/VI)
- Quick navigation links
- Logout button

### `/en/admin` — Admin Dashboard
- Stats tab: Users / Simulations / Feedbacks count
- Users tab: Full user table
- Feedbacks tab: All feedback cards
