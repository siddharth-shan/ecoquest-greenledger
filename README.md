# EcoQuest GreenLedger

**A youth-friendly civic sustainability dashboard for Cerritos, CA** that uses real, verified city financial data to connect budget literacy with environmental action.

GreenLedger transforms a 370-page adopted budget PDF into an interactive experience — letting residents explore how their tax dollars fund sustainability programs, complete real-world environmental challenges, and make their voice heard on community priorities.

## Table of Contents

- [Objective](#objective)
- [Live Demo](#live-demo)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Sources](#data-sources)
- [Key Figures](#key-figures)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [Deployment](#deployment)

## Objective

GreenLedger was built to address three civic engagement gaps:

1. **Transparency** — City budgets are published as dense PDFs that few residents read. GreenLedger makes the data explorable, filterable, and visual.
2. **Sustainability** — Cerritos has meaningful green programs (recycled water, urban forestry, solar energy) but they're scattered across city web pages. GreenLedger brings them together with verified metrics.
3. **Engagement** — Young residents lack tools to connect with local government. GreenLedger provides challenges, priority surveys, and civic action pathways that don't require voting age.

The project aligns with Goals 5, 6, and 7 of the **Cerritos Strategic Plan 2025-2027** (Technology Resources, Fiscal Transparency, and Community Communications).

## Live Demo

Deployed on Vercel with automatic deploys from the `main` branch.

**Repository**: [github.com/siddharth-shan/ecoquest-greenledger](https://github.com/siddharth-shan/ecoquest-greenledger)

## Features

### Budget Explorer (`/hub/budget`)

- Interactive breakdown of all **7 real Cerritos departments** with FY 2023-24 through FY 2025-26 data
- **Recharts bar charts** showing expenditures and revenue by category
- **Sustainability filter** — highlight departments and line items tagged with parks, water, waste, energy, or streets
- **Fiscal year selector** to compare spending across 3 budget years
- **Per-capita toggle** — see any figure divided by the city's 51,460 population
- **Budget glossary** modal with youth-friendly definitions of fiscal terms
- **10-year historical trend chart** (FY 2016-17 to 2025-26) with key event annotations from OpenGov data

### Your Tax Dollar Calculator (`/hub/tax-dollar`)

- Adjustable slider to enter any sales tax amount
- Shows exactly how each dollar is distributed across the 7 departments
- Per-dollar and per-hundred breakdowns

### Budget Simulator (`/hub/simulator`)

- Interactive sliders to reallocate the city budget across departments
- Real-time per-capita recalculation as you adjust
- See the trade-offs of shifting funds between community safety, parks, public works, and more
- Some departments are locked to reflect fixed budget obligations

### Sustainability Scorecards (`/hub/scorecards`)

Five verified sustainability programs with real metrics:

| Scorecard | Key Metric |
|-----------|-----------|
| **Recycled Water Program** | 722M gallons potable water saved/year since 1988 |
| **Urban Forestry (Tree City USA)** | 28,000+ city trees, ~250 planted/year, 25+ consecutive years as Tree City USA |
| **Solar Energy** | 1,408 sq ft on City Hall (nation's first municipal solar, 1978), 350,000 kWh/year at Corporate Yard |
| **LED Traffic Signals** | 60% energy reduction across all city intersections |
| **Clean Fleet** | All waste collection vehicles CNG-operated (Athens Services) |

Each scorecard includes 4 metrics with trend indicators (up/down/flat), highlights, and challenges.

### Community Priorities Survey (`/hub/priorities`)

- **Drag-to-reorder** interface for ranking 5 sustainability categories (parks, water, waste, energy, streets)
- Submit rankings (authenticated users)
- **Community Results** tab showing:
  - Aggregate priority scores across all respondents
  - **Priorities vs. Budget Allocation** comparison chart — see how community values align with actual FY 2025-26 spending

### Sustainability Challenges (`/challenges`)

Eight real-world challenges tied to Cerritos sustainability goals:

- **Water**: Home Water Audit, Recycled Water Trail
- **Parks**: Park Cleanup, Tree Planting
- **Waste**: Litter Collection, Recycling Audit
- **Energy**: Solar Awareness
- **Streets**: Bike Route Exploration

Each challenge includes:
- Difficulty level (easy/medium/hard), point value, and time estimate
- Step-by-step instructions (5-7 steps)
- Tips for success
- **City Goal Connection** — how this challenge links to Cerritos programs
- **Financial Snippet** — the budget context behind the initiative
- **Impact metric** — tracked contribution (gallons saved, trees cared for, litter collected)
- Completion form with personal reflection

### Community Impact Dashboard (`/impact`)

- Shared community counters tracking collective achievements: water saved, trees cared for, litter collected, volunteer hours, challenges completed
- **Animated counters** with smooth number transitions
- **Real-world equivalences** for every metric:
  - Water gallons → Olympic swimming pools (660,000 gal/pool)
  - Trees → CO2 tons absorbed (48 lbs/tree/year)
  - Litter → person-days of waste (4.4 lbs/person/day)
  - Volunteer hours → dollar value ($31.80/hr)
  - Challenges → percentage of city population (51,460)
- Methodology note explaining all calculations

### Civic Actions (`/hub/civic`)

- Public meeting schedule: City Council, Planning Commission, Parks & Recreation Commission
- Meeting times, locations, and budget relevance for each body
- **How to Participate** guide: watch live, submit public comments, read agendas, contact council members
- Youth engagement callout — participation doesn't require voting age

### Strategic Plan Alignment (`/hub/strategic-plan`)

- Maps GreenLedger features to 3 goals from the Cerritos Strategic Plan 2025-2027:
  - **Goal 5**: Technology Resources — interactive dashboards replacing static PDFs
  - **Goal 6**: Fiscal Transparency — real budget data with 7-department breakdown
  - **Goal 7**: Community Communications — two-way engagement through surveys and challenges
- Expandable goal cards with alignment details

### Printable Civic Report (`/report`)

- Server-rendered, print-optimized page covering:
  - Executive summary
  - Strategic plan alignment
  - Community engagement metrics
  - Community priority rankings
  - Environmental impact grid
  - Budget overview (4 key figures)
  - Data source citations
- Print/PDF button for physical distribution

### Data Sources (`/hub/sources`)

- All 8 official data sources cited with document name, URL, description, and access date
- **Freshness labels**: current, recent, or historical
- "Data Used For" tags linking each source to specific features

### Authentication

- **Google OAuth** for real accounts
- **Demo credentials** for testing without OAuth setup
- User profiles with challenge progress, total points, and streak tracking

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 4 (CSS-first config) |
| **Charts** | Recharts 3 |
| **Auth** | NextAuth v5 (Google OAuth + Credentials) |
| **State** | Vercel KV (with in-memory fallback) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deploy** | Vercel |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout (Navbar, Footer, AuthProvider)
│   ├── globals.css                 # Tailwind theme + custom CSS variables
│   ├── (auth)/sign-in/page.tsx     # Sign-in (Google OAuth + demo)
│   ├── challenges/
│   │   ├── page.tsx                # Challenge list with filters
│   │   └── [id]/page.tsx           # Individual challenge + completion
│   ├── impact/page.tsx             # Community impact dashboard
│   ├── profile/page.tsx            # User profile + stats
│   ├── report/page.tsx             # Printable civic report
│   ├── hub/
│   │   ├── page.tsx                # Redirects to /hub/budget
│   │   ├── budget/page.tsx         # Budget Explorer
│   │   ├── tax-dollar/page.tsx     # Tax Dollar Calculator
│   │   ├── simulator/page.tsx      # Budget Simulator
│   │   ├── scorecards/page.tsx     # Sustainability Scorecards
│   │   ├── priorities/page.tsx     # Community Priorities Survey
│   │   ├── strategic-plan/page.tsx # Strategic Plan Alignment
│   │   ├── civic/page.tsx          # Civic Actions
│   │   └── sources/page.tsx        # Data Sources
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth handlers
│       ├── challenges/             # Challenge CRUD + completion
│       ├── impact/                 # Impact counters
│       ├── stats/                  # Engagement aggregates
│       ├── surveys/                # Priority survey submit + results
│       └── user/                   # User profile data
├── components/
│   ├── budget/                     # BudgetOverview, charts, simulator, calculator
│   ├── challenges/                 # ChallengeCard
│   ├── layout/                     # Navbar, MobileNav, HubSubNav, Footer
│   ├── shared/                     # SustainabilityTag, SourceCitation, FreshnessLabel
│   └── ui/                         # AnimatedCounter, Badge, Button, Card, Modal, Tabs
├── data/
│   ├── budget/
│   │   ├── expenditures.json       # 7 departments, 3 fiscal years
│   │   ├── revenue.json            # 7 revenue categories
│   │   ├── historical.json         # 10-year trend data
│   │   └── glossary.json           # Budget terminology
│   ├── scorecards/scorecards.json  # 5 sustainability scorecards
│   ├── challenges/challenges.json  # 8 real-world challenges
│   ├── strategic-plan.json         # Strategic Plan goals
│   └── sources.json                # Data source citations
├── hooks/
│   └── useBudgetData.ts            # Budget filter/summary logic
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── kv.ts                       # Vercel KV store (with in-memory fallback)
│   ├── constants.ts                # Colors, nav items, population
│   ├── impact-equivalences.ts      # Real-world equivalence conversions
│   └── utils.ts                    # Currency formatting, classNames
└── types/
    ├── budget.ts                   # Budget interfaces
    ├── challenge.ts                # Challenge + progress types
    ├── scorecard.ts                # Scorecard interface
    ├── civic.ts                    # Civic engagement types
    └── user.ts                     # User profile type
```

## Data Sources

All data in GreenLedger is sourced from official Cerritos city documents. No data is fabricated.

| Source | Type | URL |
|--------|------|-----|
| FY 2025-26 Adopted Budget | Current | `cerritos.gov/media/purhqkrc/fy-2025-2026_adopted-budget.pdf` |
| Budget at a Glance | Current | `cerritos.gov/media/0ppcrf3a/budget-at-a-glance_web.pdf` |
| Cerritos OpenGov Portal | Current | `cerritosca.opengov.com/transparency#/` |
| FY 2024-25 Adopted Budget | Recent | `cerritos.gov` |
| Current Green Efforts | Current | `cerritos.gov/city-government/sustainability/current-green-efforts/` |
| Recycled Water Program | Current | `cerritos.gov/city-government/sustainability/recycled-water/` |
| U.S. Census Bureau (2020) | Recent | `census.gov` |
| Strategic Plan 2025-2027 | Current | `cerritos.gov` |

## Key Figures

| Metric | Value | Source |
|--------|-------|--------|
| General Fund Revenue | $101,503,081 | FY 2025-26 Adopted Budget |
| GF Operating Expenditures | $91,493,224 | FY 2025-26 Adopted Budget |
| All-Funds Operating Budget | $131,387,520 | FY 2025-26 Adopted Budget |
| Capital Improvement Plan | $23.0M | FY 2025-26 Adopted Budget |
| Population | 51,460 | U.S. Census 2020 |
| Per Capita Spending | ~$2,553 | Calculated |
| Sales Tax Revenue | $43.8M (43.2% of GF) | FY 2025-26 Adopted Budget |
| Potable Water Saved | 722M gallons/year | Recycled Water page |
| City Trees | 28,000+ | Green Efforts page |
| Solar Output (Corporate Yard) | 350,000 kWh/year | Green Efforts page |

### Department Breakdown (FY 2025-26)

| Department | Budget | % of GF |
|------------|--------|---------|
| Community Safety | $23,385,534 | 25.6% |
| Public Works | $16,537,657 | 18.1% |
| Community & Cultural Services | $15,805,251 | 17.3% |
| Theater (CCPA) | $12,302,403 | 13.4% |
| Administrative Services | $11,407,603 | 12.5% |
| Community Development | $6,677,286 | 7.3% |
| Legislative & Administrative | $3,377,490 | 3.7% |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/siddharth-shan/ecoquest-greenledger.git
cd ecoquest-greenledger
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build    # Production build (catches TypeScript errors)
npm run lint     # ESLint check
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# NextAuth (required)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional — demo login works without these)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel KV (optional — falls back to in-memory store)
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
```

The app works without any environment variables — authentication falls back to demo credentials and the KV store falls back to an in-memory Map.

## Architecture

### Data Flow

All financial data is stored as static JSON files in `src/data/` and loaded at build time. There is no external database for budget data — this ensures the app works offline and data integrity is maintained through version control.

User-generated data (challenge completions, survey responses, impact counters) is stored in Vercel KV with an in-memory fallback for local development.

### Styling

Tailwind CSS 4 is configured using the CSS-first approach in `src/app/globals.css` (not `tailwind.config.ts`). Custom CSS variables define the civic theme:

- **Navy** (`--civic-primary`): Primary UI color for government/fiscal elements
- **Teal** (`--civic-accent`): Sustainability and environmental elements
- **Gold** (`--civic-highlight`): Calls to action and community engagement
- **Orange** (`--civic-warm`): Alerts and emphasis

### Authentication

NextAuth v5 provides two auth strategies:
1. **Google OAuth** for production use
2. **Credentials provider** with demo login for development and testing

### Charts

All visualizations use Recharts 3 with responsive containers. Chart types include:
- Bar charts (department expenditures, revenue categories)
- Area charts (10-year historical trends)
- Horizontal bar charts (priority rankings)
- Line charts (fiscal year comparisons)

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication handlers |
| `/api/challenges` | GET | All challenges + user progress (if authenticated) |
| `/api/challenges` | POST | Submit challenge completion with reflection |
| `/api/impact` | GET | Community impact counters |
| `/api/stats` | GET | Aggregated engagement metrics |
| `/api/surveys` | GET | Survey aggregate results by surveyId |
| `/api/surveys` | POST | Submit priority survey response |
| `/api/user` | GET | User profile (challenges completed, points, streak) |

## Deployment

The app auto-deploys to **Vercel** on every push to `main`. Set the environment variables in the Vercel dashboard under Project Settings > Environment Variables.

```bash
# Manual deploy
vercel --prod
```

---

Built for Cerritos, CA — connecting fiscal transparency with environmental action.
