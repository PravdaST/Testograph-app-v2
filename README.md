# Testograph V2

Персонализиран 30-дневен план за повишаване на тестостерона - Companion app за TestoUp добавка

## 🎯 Overview

Testograph V2 е mobile-only PWA приложение, което предоставя:
- ✅ Научно-базиран квиз за оценка (12-15 въпроса)
- ✅ 9 персонализирани програми (3 категории × 3 нива)
- ✅ Седмичен план с точни грамажи и калории
- ✅ Workout програми с ExerciseDB video демонстрации
- ✅ TestoUp tracking (2× дневно)
- ✅ Progress analytics и compliance tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase PostgreSQL
- **API:** ExerciseDB (5,000+ exercises)
- **Icons:** Lucide React
- **PWA:** Progressive Web App (installable)

## 📁 Project Structure

```
testograph-v2/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing (redirect logic)
│   ├── mobile-only/       # Desktop block page
│   ├── quiz/              # Quiz flow (TBD)
│   ├── results/           # Quiz results (TBD)
│   └── app/               # Main dashboard (TBD)
│       ├── page.tsx       # Weekly dashboard
│       ├── workout/       # Workout details
│       ├── progress/      # Analytics
│       └── profile/       # Settings
├── components/            # React components (TBD)
├── lib/                   # Utilities and services
│   ├── utils.ts           # Helper functions
│   ├── supabase/          # Supabase clients (TBD)
│   ├── services/          # Business logic (TBD)
│   └── hooks/             # Custom React hooks (TBD)
├── types/                 # TypeScript types
│   └── index.ts           # Complete type system
├── scripts/               # Migration scripts (TBD)
├── public/                # Static assets
├── ARCHITECTURE.md        # Architecture documentation
└── DATA_FLOW.md           # Data flow diagrams
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start dev server (with Turbopack)
npm run dev

# Open http://localhost:3000 on mobile device
# Desktop users will see "Отвори на телефон" page
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🗄️ Database Setup

### 1. Create Supabase Project

Go to https://supabase.com and create a new project.

### 2. Run Migrations

```bash
# Create all 12 tables
npm run migrate:setup

# Populate with program data
npm run migrate:programs
```

### 3. Database Schema

The app uses 12 tables:
- `programs` (9 programs)
- `weekly_meals` (~300 meals)
- `meal_ingredients` (~2,000 ingredients)
- `testoup_schedule` (9 schedules)
- `workout_programs` (27 variations)
- `weekly_workouts` (~180 workouts)
- `workout_exercises` (~3,000 exercises)
- `sleep_protocols` (9 protocols)
- `purchase_codes` (one-time codes)
- `users` (user accounts)
- `user_programs` (assigned programs)
- `user_daily_logs` (compliance tracking)

## 📱 Features

### Quiz System
- 12-15 scientifically validated questions
- Multi-dimensional scoring (Physical 30%, Lifestyle 40%, Libido 30%)
- Automatic program assignment based on score (0-100)
- 3 categories: Либидо, Енергия, Мускулна маса
- 3 levels: Ниско (0-40), Нормално (41-70), Високо (71-100)

### Weekly Dashboard (Main App)
- 7-day horizontal view
- Meal cards with exact ingredients + macros
- TestoUp checkboxes (morning/evening)
- Workout links with video demos
- Sleep tracking
- Daily compliance score

### Workout System
- 3 variations: Home 🏠 / Gym 🏋️ / Yoga 🧘
- ExerciseDB integration (5,000+ exercises)
- GIF demonstrations
- Bulgarian instructions
- Sets, reps, rest times

### Progress Tracking
- 30-day compliance chart
- Weight tracking
- Streak counting
- Macro insights
- Re-quiz after day 30

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ExerciseDB API
EXERCISEDB_API_KEY=your-api-key
```

## 📱 Mobile-Only Enforcement

The app automatically detects screen width:
- **≤768px:** Show app interface
- **>768px:** Redirect to `/mobile-only` with QR code

## 🎨 Design System

Tailwind configuration includes:
- Mobile-first responsive (320px-768px)
- Custom color palette (primary, success, warning, etc.)
- Bulgarian typography
- Safe area insets for iOS
- Smooth animations
- Loading skeletons

## 📊 Data Sources

1. **ПРОГРАМИ-БЪЛГАРСКИ.md** - 9 complete 30-day programs
2. **НАУЧНО-БАЗИРАНИ-ПРЕПОРЪКИ-TESTOGRAPH.md** - Scientific basis
3. **TESTOSTERONE_QUIZ_RESEARCH_REPORT.md** - Quiz research
4. **ExerciseDB API** - Exercise videos and instructions

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit

# Manual testing on mobile device
# Use ngrok or similar to expose localhost
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables on Vercel
Add the same variables from `.env.local` to Vercel project settings.

## 🔄 Current Status

### ✅ Completed
- Project structure setup
- Next.js 15 + TypeScript configuration
- Tailwind CSS + custom design system
- Mobile-only enforcement
- Architecture documentation
- Complete type system (100+ types)
- Data flow diagrams

### 🚧 In Progress
- Supabase setup и migration scripts

### 📋 Todo
- Build Quiz flow със scoring logic
- Build Weekly Dashboard (main app)
- ExerciseDB integration за workout videos
- Progress tracking и analytics
- PWA setup и mobile optimization
- Testing и final polish

## 📄 License

Private - TestoUp Companion App

## 👥 Contact

For questions or support, contact the Testograph team.
