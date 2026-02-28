# CLAUDE.md — EcoQuest GreenLedger

## Project Overview
**EcoQuest GreenLedger** is a youth-friendly civic sustainability dashboard for **Cerritos, CA** that uses **real, verified city financial data** to connect budget literacy with environmental action. Built with Next.js 15, TypeScript, Tailwind CSS 4, Recharts, and NextAuth v5.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 4 (CSS-first config via `src/app/globals.css`, NOT `tailwind.config.ts`)
- **Charts**: Recharts
- **Auth**: NextAuth v5 (OAuth with Google/GitHub)
- **State**: Vercel KV for impact counters
- **Deploy**: Vercel

## Key Commands
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build (catches type errors)
npm run lint     # ESLint check
```

## Data Architecture
All financial data lives in `src/data/` as JSON files loaded at build time:
- `budget/expenditures.json` — 7 real Cerritos departments with 3-year data (FY 2023-24 to 2025-26)
- `budget/revenue.json` — 7 revenue categories from adopted budget
- `budget/historical.json` — 10-year trend data from OpenGov (FY 2016-17 to 2025-26)
- `budget/glossary.json` — Cerritos-specific financial terms
- `scorecards/scorecards.json` — 5 verified sustainability scorecards
- `challenges/challenges.json` — 8 real-world sustainability challenges
- `sources.json` — All data source citations with real URLs

## Real Data Sources (Verified)
| Source | URL |
|--------|-----|
| FY 2025-26 Adopted Budget | `cerritos.gov/media/purhqkrc/fy-2025-2026_adopted-budget.pdf` |
| Budget at a Glance | `cerritos.gov/media/0ppcrf3a/budget-at-a-glance_web.pdf` |
| OpenGov Transparency | `cerritosca.opengov.com/transparency#/` |
| Green Efforts | `cerritos.gov/city-government/sustainability/current-green-efforts/` |
| Recycled Water | `cerritos.gov/city-government/sustainability/recycled-water/` |

## Key Real Figures
- **General Fund Revenue**: $101,503,081 (FY 2025-26)
- **GF Operating Expenditures**: $91,493,224
- **All-Funds Operating**: $131,387,520
- **CIP**: $23.0M
- **Population**: 51,460
- **Sales Tax**: $43.8M (43.2% of GF — Auto Square generates ~$14.6M)
- **7 Departments**: Community Safety, Public Works, Community & Cultural Services, Theater (CCPA), Administrative Services, Community Development, Legislative & Administrative

## Department Structure (7 Real Departments)
| Department | FY 2025-26 | % of GF |
|------------|-----------|---------|
| Community Safety | $23,385,534 | 25.6% |
| Public Works | $16,537,657 | 18.1% |
| Community & Cultural Services | $15,805,251 | 17.3% |
| Theater (CCPA) | $12,302,403 | 13.4% |
| Administrative Services | $11,407,603 | 12.5% |
| Community Development | $6,677,286 | 7.3% |
| Legislative & Administrative | $3,377,490 | 3.7% |

## Sustainability Metrics (All Verified)
- 722M gallons potable water saved/year (recycled water since 1988)
- 28,000+ city trees; ~250 planted/year; Tree City USA 25+ years
- 350,000 kWh/year solar (Corporate Yard)
- 1,408 sq ft solar panels on City Hall (nation's first, 1978)
- LED traffic signals: 60% energy reduction
- All waste vehicles CNG-operated (Athens Services)

## Project Structure
```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── hub/
│   │   ├── budget/page.tsx   # Budget Explorer
│   │   ├── scorecards/page.tsx
│   │   ├── priorities/page.tsx
│   │   ├── civic/page.tsx    # Civic Actions (needs building)
│   │   ├── sources/page.tsx
│   │   ├── tax-dollar/       # NEW - needs building
│   │   └── simulator/        # NEW - needs building
│   ├── challenges/page.tsx
│   ├── impact/page.tsx
│   └── api/
├── components/
│   ├── budget/               # BudgetOverview, charts
│   ├── challenges/           # ChallengeCard
│   ├── layout/               # HubSubNav, nav
│   ├── shared/               # Reusable components
│   └── ui/                   # AnimatedCounter, etc.
├── data/                     # All JSON data files
├── hooks/                    # useBudgetData
├── lib/                      # constants, utils
└── types/                    # TypeScript interfaces
```

## GitHub & Deployment
- **Repo**: https://github.com/siddharth-shan/ecoquest-greenledger
- **Vercel**: Auto-deploys from main branch
- **Auth**: Requires NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

## Style Conventions
- Use Tailwind utility classes (CSS-first approach in globals.css)
- Custom CSS variables for theme colors (eco-green, eco-blue, etc.)
- Lucide React icons throughout
- Mobile-first responsive design
- `container-custom`, `section-padding`, `section-title` utility classes
