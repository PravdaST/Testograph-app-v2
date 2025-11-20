# Performance Optimization Guide

## 🐌 Current Problems

Based on dev server logs analysis:

| Issue | Current | Impact |
|-------|---------|--------|
| `/api/user/daily-completion` | 3000ms | 🔴 Critical |
| Duplicate `/api/user/program` calls | 4-5x per page load | 🔴 High |
| Waterfall API calls | Sequential loading | 🟡 Medium |
| No loading states | Empty page while loading | 🟡 Medium |
| Large bundle (`/app/nutrition`) | 226 kB | 🟡 Medium |

---

## ⚡ Quick Win #1: Database Indexes (10x improvement)

**Time:** 5 minutes
**Risk:** Zero
**Impact:** 3000ms → 100-300ms for database queries

### Steps:

1. **Open Supabase Dashboard** → SQL Editor

2. **Copy & Paste** contents from: `scripts/add-performance-indexes.sql`

3. **Run the query**

4. **Verify** indexes were created (query result shows all indexes)

### Expected Results:
```
BEFORE indexes:
GET /api/user/daily-completion → 3068ms ❌

AFTER indexes:
GET /api/user/daily-completion → 100-300ms ✅
```

---

## ⚡ Quick Win #2: Parallel API Calls (3x improvement)

**Time:** 15 minutes
**Risk:** Low
**Impact:** 4000ms → 1500ms for page load

### Current Problem:
```typescript
// Sequential (waterfall) - BAD ❌
const program = await fetch('/api/user/program')     // 1000ms
const access = await fetch('/api/user/access')       // 1000ms
const details = await fetch('/api/user/day-details') // 1500ms
// TOTAL: 3500ms
```

### Solution:
```typescript
// Parallel - GOOD ✅
const [program, access, details] = await Promise.all([
  fetch('/api/user/program?email=' + email),
  fetch('/api/user/access?email=' + email),
  fetch('/api/user/day-details?email=' + email + '&date=' + date)
])
// TOTAL: 1500ms (only the slowest query)
```

**Files to refactor:**
- `app/app/page.tsx` (Dashboard)
- `app/app/nutrition/page.tsx`
- `app/app/supplement/page.tsx`
- `app/app/sleep/page.tsx`

---

## ⚡ Quick Win #3: Loading Skeletons (perceived 2x faster)

**Time:** 30 minutes
**Risk:** Zero
**Impact:** User sees progress instead of blank page

### Example Skeleton Component:

```tsx
export function StatCardSkeleton() {
  return (
    <div className="animate-pulse bg-muted/30 rounded-xl p-4">
      <div className="h-5 w-5 bg-muted rounded-lg mb-2" />
      <div className="h-6 w-16 bg-muted rounded mb-1" />
      <div className="h-3 w-24 bg-muted rounded" />
    </div>
  )
}
```

### Usage:
```tsx
{loading ? (
  <StatCardSkeleton />
) : (
  <StatCard data={stats} />
)}
```

---

## 🚀 Medium Optimization: SWR for API Caching

**Time:** 1-2 hours
**Risk:** Medium
**Impact:** Eliminates duplicate API calls, instant navigation

### Install SWR:
```bash
npm install swr
```

### Example Usage:
```tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Dashboard() {
  const { data: program, error } = useSWR(
    `/api/user/program?email=${email}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 // Cache 1 minute
    }
  )

  if (error) return <ErrorState />
  if (!program) return <SkeletonState />

  return <DashboardContent program={program} />
}
```

### Benefits:
- ✅ Automatic deduplication (no more duplicate calls)
- ✅ Client-side cache (instant navigation)
- ✅ Background revalidation
- ✅ Optimistic updates

---

## 🔥 Advanced: React.lazy for Code Splitting

**Time:** 2-3 hours
**Risk:** High
**Impact:** Bundle size reduction (226 kB → 100 kB for nutrition page)

### Example:
```tsx
import { lazy, Suspense } from 'react'

const MealPlanViewer = lazy(() =>
  import('@/components/nutrition/MealPlanViewer')
)

export default function NutritionPage() {
  return (
    <Suspense fallback={<MealPlanSkeleton />}>
      <MealPlanViewer />
    </Suspense>
  )
}
```

---

## 📊 Expected Results (After All Optimizations)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| `/app` page load | 4000ms | **800-1200ms** | 🚀 3-5x faster |
| Database queries | 3000ms | **100-300ms** | 🚀 10x faster |
| Navigation speed | 2000ms | **300-500ms** | 🚀 4-6x faster |
| Bundle size (nutrition) | 226 kB | **100-120 kB** | ✅ 50% smaller |
| API calls (duplicate) | 4-5x | **1x** | ✅ Eliminated |

---

## 🎯 Recommended Order:

1. ✅ **Database Indexes** (5 min, zero risk, huge impact)
2. ✅ **Parallel API Calls** (15 min, low risk, big impact)
3. ✅ **Loading Skeletons** (30 min, zero risk, UX improvement)
4. 🟡 **SWR Caching** (1-2h, medium risk, good impact)
5. 🔴 **Code Splitting** (2-3h, high risk, medium impact)

---

## ❌ NOT Recommended: Dependency Upgrades

**Current Versions:**
- Next.js 15.5 → Latest: 16.0.3 (major version)
- React 19.2.0 → Latest: 19.2.0 ✅ (already latest)
- Supabase 2.81.1 → Latest: 2.84.0 (minor update)

**Why NOT upgrade now:**
- Next.js 16 is major version (released days ago)
- High risk: Breaking changes in middleware, API routes
- Low reward: 0-5% performance gain
- Time investment: Hours/days of debugging

**Verdict:** Fix the architecture problems first, then consider upgrades later.

---

*Last updated: 2025-11-20*
*Author: Claude Code*
