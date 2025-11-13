# Testograph v2 - AI Agent Workforce Structure

**Version:** 1.0
**Last Updated:** 2025-11-13
**Project Size:** 24,270 lines of TypeScript/React code

---

## Executive Summary

Testograph v2 is a sophisticated health and fitness platform requiring **10 specialized AI agents** organized into **3 priority tiers**. This document defines the optimal workforce structure for development, maintenance, content creation, and optimization.

**Core Team:** 6 agents (40 hours/week)
**Strategic Team:** 4 agents (on-demand activation)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Workforce Structure](#workforce-structure)
3. [Tier 1: Essential Agents](#tier-1-essential-agents)
4. [Tier 2: High-Value Agents](#tier-2-high-value-agents)
5. [Tier 3: Strategic Agents](#tier-3-strategic-agents)
6. [Collaboration Patterns](#collaboration-patterns)
7. [Time Allocation](#time-allocation)
8. [Weekly Rotation](#weekly-rotation)
9. [Success Metrics](#success-metrics)
10. [Activation Protocols](#activation-protocols)

---

## Project Overview

### Technical Stack
- **Framework:** Next.js 15 App Router
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL), 60+ API routes
- **Integrations:** Shopify, ExerciseDB, Gemini AI
- **Language:** Bulgarian primary, English secondary

### Functional Areas
1. **Quiz & Onboarding:** 78 questions, 3 categories, scoring algorithm
2. **Meal Planning:** 9 programs × 30 days, 300+ meals, 2,000+ ingredients
3. **Workout System:** 180 workouts, 3,000+ exercises, video demonstrations
4. **Supplement Tracking:** TestoUP inventory, Shopify integration
5. **Sleep Monitoring:** Daily tracking, weekly analytics
6. **Progress Tracking:** Charts, streaks, completion metrics
7. **Backend:** 15+ database tables, authentication, webhooks

### Scale Metrics
- **Code:** 24,270 lines
- **Files:** 200+ TypeScript/React files
- **API Routes:** 60+ endpoints
- **Database Tables:** 15+
- **Meal Plans:** 18 files (9 programs × 2 locations)
- **Workout Plans:** 18 files (9 programs × 2 locations)
- **Quiz Questions:** 78 across 3 categories
- **Users:** Multi-tenant Bulgarian health/fitness audience

---

## Workforce Structure

### Organization Principles

1. **Specialization Over Generalization**
   - Each agent has deep expertise in specific domain
   - Clear boundaries prevent overlap and confusion

2. **Tier-Based Prioritization**
   - Tier 1: Daily essential operations
   - Tier 2: Weekly high-value tasks
   - Tier 3: On-demand strategic initiatives

3. **Collaborative Patterns**
   - Defined workflows for common tasks
   - Handoff protocols between agents
   - Shared context and knowledge base

4. **Resource Optimization**
   - 40-hour weekly allocation for core team
   - On-demand activation for specialists
   - Focus time blocks for deep work

---

## Tier 1: Essential Agents

### 🔧 Agent 1: Backend & Database Architect

**Primary Focus:** API routes, Supabase database, data integrity

#### Responsibilities
- Design and maintain 15+ Supabase database tables
- Write and execute SQL migrations
- Create and optimize 60+ Next.js API routes
- Handle Shopify webhook processing (HMAC validation)
- Implement Row Level Security (RLS) policies
- Monitor database performance and query optimization
- Debug data integrity issues
- Ensure proper error handling across all endpoints

#### When to Activate
- ✅ Database schema changes required
- ✅ New API endpoint needed
- ✅ Query performance issues (>200ms)
- ✅ Webhook failures or data sync issues
- ✅ Migration scripts needed
- ✅ RLS policy updates
- ✅ Data integrity violations

#### Skills Required
- PostgreSQL/Supabase expert
- Next.js API Routes & Route Handlers
- RESTful API design principles
- SQL query optimization
- Webhook security (HMAC, signatures)
- TypeScript backend patterns
- Error handling & logging

#### Key Files
```
supabase/migrations/*.sql
app/api/**/*.ts (60+ routes)
lib/supabase/server.ts
lib/supabase/client.ts
types/database.ts
lib/shopify/webhook.ts
```

#### Success Metrics
- API response time: < 200ms average
- Uptime: 99.9%+
- Zero critical data integrity issues
- Webhook success rate: > 99%
- Query optimization: < 100ms for complex queries

#### Example Tasks
1. Create new API endpoint for workout streak tracking
2. Optimize slow query in meal plan loading (currently 450ms)
3. Add database index for faster email lookups
4. Debug Shopify webhook verification failure
5. Write migration to add `workout_location` column

---

### 🎨 Agent 2: Frontend UI/UX Specialist

**Primary Focus:** React components, mobile design, user experience

#### Responsibilities
- Build and maintain 40+ React components
- Implement mobile-first responsive design
- Style with Tailwind CSS following design system
- Optimize component performance (memoization, dynamic imports)
- Handle loading states and error boundaries
- Ensure WCAG 2.1 accessibility compliance
- Create smooth animations and transitions
- Manage Bulgarian language UI text
- Implement proper TypeScript types for props

#### When to Activate
- ✅ New UI component needed
- ✅ Existing component refactoring
- ✅ Mobile responsiveness issues
- ✅ Performance optimization (bundle size, re-renders)
- ✅ User flow improvements
- ✅ Accessibility compliance
- ✅ Animation and interaction polish

#### Skills Required
- React 19 (Server Components, Client Components)
- Next.js 15 App Router
- Tailwind CSS advanced patterns
- Mobile-first responsive design
- Performance optimization (React.memo, useMemo, useCallback)
- Dynamic imports (next/dynamic)
- TypeScript with React
- Accessibility best practices
- Bulgarian language

#### Key Files
```
components/**/*.tsx (24 files)
app/app/**/*.tsx (page components)
app/app/*/page.tsx (route pages)
contexts/UserProgramContext.tsx
components/workout/ExerciseProgressChartLazy.tsx
components/navigation/TopNav.tsx
components/navigation/BottomNav.tsx
```

#### Success Metrics
- Lighthouse Performance Score: > 90
- Mobile usability: 100%
- Component reusability: > 70%
- Bundle size per page: < 200kB
- Accessibility score: > 95
- Zero layout shift (CLS = 0)

#### Example Tasks
1. Create workout streak widget for dashboard
2. Optimize Progress page bundle size (currently 226kB)
3. Fix mobile menu overflow on iPhone SE
4. Add loading skeleton for meal cards
5. Implement smooth scroll animations

---

### 🔗 Agent 3: Integration & Automation Specialist

**Primary Focus:** Third-party APIs, webhooks, automation workflows

#### Responsibilities
- Integrate and maintain Shopify API connection
- Manage ExerciseDB API integration (~3,000 exercises)
- Optimize Gemini AI prompts for content generation
- Handle email automation (welcome emails, notifications)
- Implement purchase verification workflows
- Monitor TestoUP inventory via Shopify
- Debug webhook failures and retry logic
- Rate limiting and error handling for third-party APIs
- API key rotation and security

#### When to Activate
- ✅ Shopify integration issues
- ✅ ExerciseDB API changes or failures
- ✅ Gemini AI prompt optimization needed
- ✅ Webhook processing failures
- ✅ Email delivery issues
- ✅ Third-party API rate limiting
- ✅ New integration required

#### Skills Required
- REST API integration patterns
- Webhook security (HMAC, signatures)
- Error handling and exponential backoff
- Async/await patterns in TypeScript
- Rate limiting strategies
- Email service integration
- API monitoring and alerting
- Prompt engineering (Gemini AI)

#### Key Files
```
app/api/webhooks/shopify/route.ts
lib/services/exercisedb.ts
lib/gemini/client.ts
lib/email/welcome.ts
lib/shopify/webhook.ts
app/api/shopify/*.ts
lib/services/*.ts
```

#### Success Metrics
- Webhook success rate: > 99%
- API uptime: > 99.5%
- Email delivery rate: > 95%
- ExerciseDB cache hit rate: > 80%
- Gemini AI response time: < 3s
- Zero missed purchase events

#### Example Tasks
1. Debug Shopify webhook HMAC validation failure
2. Implement ExerciseDB caching to reduce API calls
3. Optimize Gemini AI meal substitution prompt (reduce tokens by 30%)
4. Add retry logic for failed email sends
5. Create new integration with nutrition API

---

## Tier 2: High-Value Agents

### 🥗 Agent 4: Nutrition & Meal Planning Specialist

**Primary Focus:** Bulgarian recipes, macro calculations, dietary variations

#### Responsibilities
- Create and maintain 9 meal programs (Energy, Libido, Muscle × Low/Normal/High)
- Design 30-day meal plans with daily variety
- Calculate accurate macros (protein, carbs, fats, calories)
- Develop authentic Bulgarian recipes
- Handle dietary substitutions (omnivore, vegetarian, vegan, pescatarian)
- Work with Gemini AI for intelligent meal generation
- Ensure seasonal meal variations
- Source Bulgarian ingredients
- Validate nutritional accuracy

#### When to Activate
- ✅ Adding new recipes to meal plans
- ✅ Adjusting macro targets for programs
- ✅ Handling dietary restriction requests
- ✅ Creating seasonal meal variations
- ✅ Fixing macro calculation errors
- ✅ Improving AI meal substitution logic
- ✅ Expanding meal library

#### Skills Required
- Nutrition science (macro/micro nutrients)
- Bulgarian cuisine expertise
- Recipe development and testing
- Dietary restriction knowledge
- Gemini AI prompt engineering
- TypeScript data structures for meal plans
- Food pairing and flavor profiles

#### Key Files
```
lib/data/mock-meal-plan-energy-low.ts
lib/data/mock-meal-plan-energy-normal.ts
lib/data/mock-meal-plan-energy-high.ts
lib/data/mock-meal-plan-libido-low.ts
lib/data/mock-meal-plan-libido-normal.ts
lib/data/mock-meal-plan-libido-high.ts
lib/data/mock-meal-plan-muscle-low.ts
lib/data/mock-meal-plan-muscle-normal.ts
lib/data/mock-meal-plan-muscle-high.ts
app/api/meals/*.ts
lib/utils/meal-substitution.ts
lib/data/dietary-substitutions.ts
```

#### Success Metrics
- Macro accuracy: ± 5%
- Meal variety: > 100 unique recipes
- Dietary coverage: 4 preferences supported
- AI substitution quality: > 85% user satisfaction
- Recipe Bulgarian authenticity: 100%
- Seasonal rotation: 4 variations/year

#### Example Tasks
1. Create summer meal variations with seasonal vegetables
2. Design new vegan meal plan for Muscle High program
3. Fix macro calculation error in Energy Low breakfast
4. Add 10 new Bulgarian dinner recipes
5. Optimize Gemini prompt for better pescatarian substitutions

---

### 💪 Agent 5: Workout & Exercise Specialist

**Primary Focus:** Exercise programming, ExerciseDB, Bulgarian translations

#### Responsibilities
- Design 30-day progressive workout programs
- Manage 9 workout variations (3 categories × 3 levels)
- Create home vs gym equipment variations
- Integrate and maintain ~3,000 exercises from ExerciseDB
- Translate exercise names and instructions to Bulgarian
- Design warm-up and cool-down routines
- Implement progressive overload principles
- Ensure proper exercise form descriptions
- Manage exercise GIF/video quality

#### When to Activate
- ✅ Creating new workout programs
- ✅ Adding exercises to library
- ✅ Fixing ExerciseDB API issues
- ✅ Translating exercise names to Bulgarian
- ✅ Adjusting workout difficulty levels
- ✅ Programming periodization
- ✅ Exercise substitution logic

#### Skills Required
- Exercise science and kinesiology
- Workout programming (periodization, progressive overload)
- ExerciseDB API knowledge
- Bulgarian fitness terminology
- TypeScript for exercise data structures
- Video/GIF quality assessment
- Home vs gym equipment alternatives

#### Key Files
```
lib/data/mock-workouts-energy-low-home.ts
lib/data/mock-workouts-energy-normal-home.ts
lib/data/mock-workouts-energy-high-home.ts
lib/data/mock-workouts-energy-low-gym.ts
lib/data/mock-workouts-energy-normal-gym.ts
lib/data/mock-workouts-energy-high-gym.ts
lib/data/mock-workouts-libido-low-home.ts
lib/data/mock-workouts-libido-normal-home.ts
lib/data/mock-workouts-libido-high-home.ts
lib/data/mock-workouts-libido-low-gym.ts
lib/data/mock-workouts-libido-normal-gym.ts
lib/data/mock-workouts-libido-high-gym.ts
lib/data/mock-workouts-muscle-low-home.ts
lib/data/mock-workouts-muscle-normal-home.ts
lib/data/mock-workouts-muscle-high-home.ts
lib/data/mock-workouts-muscle-low-gym.ts
lib/data/mock-workouts-muscle-normal-gym.ts
lib/data/mock-workouts-muscle-high-gym.ts
lib/services/exercisedb.ts
app/api/workout/*.ts
lib/data/exercises.json
lib/data/warm-up-routines.ts
lib/data/cool-down-routines.ts
```

#### Success Metrics
- Exercise library: > 500 Bulgarian-translated exercises
- Video quality: 100% working GIFs
- Program effectiveness: Progressive overload implemented
- Home/Gym variants: 100% coverage
- ExerciseDB uptime: > 95%
- User workout completion rate: > 70%

#### Example Tasks
1. Design new Muscle High program with advanced techniques
2. Add 50 new home bodyweight exercises
3. Translate compound lift instructions to Bulgarian
4. Fix broken GIF links for shoulder exercises
5. Create beginner-friendly workout variations

---

### 🧪 Agent 6: Testing & Quality Assurance

**Primary Focus:** Bug detection, code quality, security

#### Responsibilities
- Write and maintain test suite
- Bug reproduction and root cause analysis
- Code review for all pull requests
- Performance testing (load testing, stress testing)
- Security audits (SQL injection, XSS, CSRF)
- Dependency vulnerability scanning
- TypeScript strict mode enforcement
- E2E testing with Playwright
- Unit testing with Jest/Vitest
- Integration testing for API routes

#### When to Activate
- ✅ Before major releases
- ✅ After significant refactoring
- ✅ Security vulnerability reports
- ✅ Performance degradation detected
- ✅ TypeScript errors accumulating
- ✅ Dependency updates needed
- ✅ Bug reports from users

#### Skills Required
- Testing frameworks (Jest, Vitest, Playwright)
- Debugging techniques (Chrome DevTools, React DevTools)
- Code review best practices
- Security awareness (OWASP Top 10)
- Performance profiling tools
- TypeScript strict mode patterns
- CI/CD pipeline configuration

#### Key Files
```
All codebase files for review
package.json (dependency management)
tsconfig.json (TypeScript config)
Tests (when created)
```

#### Success Metrics
- Code coverage: > 80%
- Zero critical bugs in production
- Security vulnerabilities: 0 high/critical
- TypeScript errors: 0
- Performance regression: < 5%
- Test execution time: < 5 minutes

#### Example Tasks
1. Write E2E tests for quiz flow
2. Audit Supabase RLS policies for security
3. Review and approve Backend Architect's database migration
4. Performance test meal plan loading with 1000 concurrent users
5. Update dependencies and fix breaking changes

---

## Tier 3: Strategic Agents

### 📊 Agent 7: Quiz & Scoring Specialist

**Primary Focus:** Question design, scoring logic, personalization

#### Responsibilities
- Design and validate 78 quiz questions
- Optimize scoring algorithms (symptoms 30%, lifestyle 40%, libido 30%)
- A/B test question effectiveness
- Analyze quiz completion rates
- Ensure proper program assignment logic
- Bulgarian language content validation
- Psychological questionnaire principles
- Drop-off point identification

#### When to Activate
- Adding/modifying quiz questions
- Adjusting scoring weights
- Investigating incorrect program assignments
- Improving quiz conversion rates
- Translating quiz content

#### Skills Required
- Psychology and questionnaire design
- Data analysis (quiz metrics)
- Bulgarian language proficiency
- TypeScript for scoring logic
- Supabase queries for quiz data
- A/B testing frameworks

#### Key Files
```
lib/data/quiz/energy-questions.json
lib/data/quiz/libido-questions.json
lib/data/quiz/muscle-questions.json
app/api/quiz/complete/route.ts
lib/utils/quiz-scoring.ts
```

#### Success Metrics
- Quiz completion rate: > 70%
- Program assignment accuracy: > 95%
- Question clarity score: > 4.5/5
- Drop-off rate: < 20%
- A/B test win rate: > 55%

---

### 📈 Agent 8: Data Analyst & Optimization

**Primary Focus:** Analytics, performance monitoring, data insights

#### Responsibilities
- Analyze quiz completion rates
- Track user engagement metrics
- Identify drop-off points in funnels
- A/B testing result analysis
- Performance metrics monitoring
- Database query performance analysis
- Feature effectiveness measurement
- User behavior pattern recognition

#### When to Activate
- Making data-driven decisions
- Optimizing conversion funnels
- Understanding user behavior
- Performance optimization initiatives
- Feature prioritization
- Program effectiveness analysis

#### Skills Required
- Data analysis and statistics
- SQL queries (complex aggregations)
- Data visualization (Recharts)
- Performance monitoring tools
- User behavior analysis
- A/B testing frameworks
- Funnel analysis

#### Key Files
```
Supabase database (all tables)
components/workout/ExerciseProgressChart.tsx
app/app/progress/page.tsx
Analytics dashboards (when created)
```

#### Success Metrics
- Data accuracy: 100%
- Insight actionability: > 80%
- Report turnaround: < 24 hours
- Optimization recommendations: > 3 per month
- ROI on implemented changes: > 20%

---

### 🇧🇬 Agent 9: Content Creator & Localization

**Primary Focus:** Bulgarian language content, cultural adaptation

#### Responsibilities
- Create Bulgarian quiz questions
- Write meal recipes in Bulgarian
- Translate exercise instructions
- Sleep advice content
- UI text and messaging
- Email templates
- Cultural appropriateness review
- Grammar and style consistency

#### When to Activate
- New content creation
- Translation needs
- Cultural sensitivity review
- User communication templates
- Marketing copy

#### Skills Required
- Native Bulgarian speaker
- Health & fitness terminology (Bulgarian)
- Copywriting
- Cultural awareness
- Translation skills
- Content strategy

#### Key Files
```
lib/data/quiz/*.json
lib/data/mock-meal-plan-*.ts
lib/data/sleep-recommendations.ts
lib/email/welcome.ts
UI text files
```

#### Success Metrics
- Translation accuracy: 100%
- Cultural appropriateness: 100%
- Grammar errors: 0
- Content consistency: > 95%
- User comprehension: > 90%

---

### 📚 Agent 10: Documentation & Knowledge Manager

**Primary Focus:** Technical docs, user guides, knowledge base

#### Responsibilities
- Maintain README and technical documentation
- API endpoint documentation
- Component documentation
- Architecture diagrams
- Deployment guides
- User guides (Bulgarian)
- FAQ content
- Onboarding materials

#### When to Activate
- New feature launches
- Architecture changes
- Onboarding new developers
- User support escalations
- Creating tutorials

#### Skills Required
- Technical writing
- Markdown
- Bulgarian language
- Architecture understanding
- Documentation tools
- Diagram creation

#### Key Files
```
README.md
WORKFLOW-ANALYSIS.md
CONTEXT7-ANALYSIS.md
claude.md
ALL_QUIZ_QUESTIONS.md
WORKFORCE-STRUCTURE.md (this file)
```

#### Success Metrics
- Documentation coverage: > 90% of features
- Documentation accuracy: 100%
- User self-service rate: > 60%
- Onboarding time reduction: > 30%

---

## Collaboration Patterns

### Pattern 1: New Feature Development

**Scenario:** Add "Workout Streak" tracking feature

```
Step 1: Backend & Database Architect
- Create database table: workout_streaks
- Add columns: user_email, current_streak, longest_streak, last_workout_date
- Write API route: /api/workout/streak (GET, POST)
- Implement streak calculation logic

Step 2: Frontend UI/UX Specialist
- Create StreakWidget component
- Display current streak with fire icon
- Add celebratory animation on milestone (7, 30, 100 days)
- Mobile-responsive design

Step 3: Testing & Quality Assurance
- Write unit tests for streak calculation
- E2E test: complete workout → streak increments
- Test edge cases: timezone handling, missed days

Step 4: Documentation & Knowledge Manager
- Update API documentation
- Add feature to user guide (Bulgarian)
- Create screenshot for README
```

**Total Time:** 8 hours (Backend: 3h, Frontend: 3h, Testing: 1h, Docs: 1h)

---

### Pattern 2: Content Expansion (New Meal Plan)

**Scenario:** Create Spring seasonal meal variations

```
Step 1: Nutrition & Meal Planning Specialist
- Research spring vegetables in Bulgaria (spinach, peas, asparagus)
- Design 30-day spring meal plan for Energy Normal
- Calculate macros for all meals
- Write Bulgarian recipe descriptions

Step 2: Content Creator & Localization
- Review recipe descriptions for grammar
- Ensure cultural appropriateness
- Translate any English ingredient names
- Polish UI text for seasonal selector

Step 3: Backend & Database Architect
- Create meal_plan_seasons table
- Add season field to meal plans
- Update API to support seasonal filtering

Step 4: Frontend UI/UX Specialist
- Add season selector dropdown
- Display "Spring Edition" badge on seasonal meals
- Update meal card design with spring theme colors
```

**Total Time:** 12 hours (Nutrition: 6h, Content: 2h, Backend: 2h, Frontend: 2h)

---

### Pattern 3: Bug Fixing

**Scenario:** Meal macro calculations incorrect for Muscle High program

```
Step 1: Testing & Quality Assurance
- Reproduce bug with specific meal example
- Identify root cause: typo in protein calculation (×10 instead of ×4)
- Document expected vs actual values
- Create test case to prevent regression

Step 2: Nutrition & Meal Planning Specialist
- Fix calculation in mock-meal-plan-muscle-high.ts
- Recalculate all affected meals
- Validate macros for entire 30-day plan
- Update totals and daily targets

Step 3: Testing & Quality Assurance (verification)
- Run test suite to confirm fix
- Manual verification on 3 sample meals
- Check other programs not affected

Step 4: Documentation & Knowledge Manager
- Update CHANGELOG.md with bug fix
- Add note to meal plan documentation
```

**Total Time:** 3 hours (Testing: 1h, Nutrition: 1.5h, Testing: 0.25h, Docs: 0.25h)

---

### Pattern 4: Performance Optimization

**Scenario:** Progress page loading slowly (3+ seconds)

```
Step 1: Data Analyst & Optimization
- Identify bottleneck: Recharts library (107 kB)
- Measure current performance: 226 kB First Load JS
- Analyze user behavior: chart viewed by only 60% of users
- Recommend: dynamic import for Recharts

Step 2: Frontend UI/UX Specialist
- Create ExerciseProgressChartLazy.tsx wrapper
- Implement next/dynamic with loading state
- Add proper TypeScript types
- Test on slow 3G network

Step 3: Testing & Quality Assurance
- Performance test: measure improvement
- Visual regression test: chart still looks correct
- Mobile device testing (iOS, Android)
- Lighthouse audit

Step 4: Data Analyst & Optimization (validation)
- Measure new performance: 116 kB First Load JS (-48.7%)
- Confirm bundle size reduction: 4.89 kB (-95.4%)
- Monitor real user metrics for 1 week
- Report success to stakeholders
```

**Total Time:** 6 hours (Analysis: 1h, Frontend: 3h, Testing: 1h, Analysis: 1h)

---

## Time Allocation

### Weekly Schedule (40 hours/week)

| Agent | Mon | Tue | Wed | Thu | Fri | Total |
|-------|-----|-----|-----|-----|-----|-------|
| **Backend Architect** | 3h | 3h | 2h | 2h | 2h | **12h** |
| **Frontend Specialist** | 3h | 3h | 2h | 2h | 2h | **12h** |
| **Integration Specialist** | 2h | 2h | 1h | 2h | 1h | **8h** |
| **Testing QA** | 1h | 1h | 1h | 0.5h | 0.5h | **4h** |
| **Nutrition Specialist** | - | 2h | - | - | - | **2h** |
| **Workout Specialist** | - | - | 2h | - | - | **2h** |
| **TOTAL** | **9h** | **11h** | **8h** | **6.5h** | **5.5h** | **40h** |

### As-Needed Activation

- **Quiz Specialist:** 2-4 hours/month
- **Data Analyst:** 4-6 hours/month
- **Content Creator:** 2-4 hours/month
- **Documentation Manager:** 2-3 hours/month

### Busy vs Quiet Periods

**High Activity (Feature Development):**
- Backend: 15h/week
- Frontend: 15h/week
- Testing: 6h/week

**Maintenance Mode:**
- Backend: 8h/week
- Frontend: 8h/week
- Integration: 6h/week
- Testing: 2h/week

---

## Weekly Rotation

### Monday: Infrastructure & Integration Day
**Focus:** Backend reliability, API health, webhook monitoring

**Active Agents:**
- Backend Architect (3h)
- Frontend Specialist (3h)
- Integration Specialist (2h)
- Testing QA (1h)

**Tasks:**
- Review weekend logs
- Fix any webhook failures
- Monitor API performance
- Deploy urgent fixes

---

### Tuesday: Content Creation Day
**Focus:** Meal planning, workout programming

**Active Agents:**
- Backend Architect (3h)
- Frontend Specialist (3h)
- Integration Specialist (2h)
- Nutrition Specialist (2h) ← **Featured**
- Testing QA (1h)

**Tasks:**
- Review and approve new meal plans
- Add seasonal recipe variations
- Update workout exercises
- Test content display

---

### Wednesday: Code Quality Day
**Focus:** Testing, refactoring, tech debt

**Active Agents:**
- Backend Architect (2h)
- Frontend Specialist (2h)
- Workout Specialist (2h) ← **Featured**
- Integration Specialist (1h)
- Testing QA (1h)

**Tasks:**
- Code review sessions
- Refactor complex components
- Write missing tests
- Update workout library

---

### Thursday: Optimization Day
**Focus:** Performance, data analysis

**Active Agents:**
- Backend Architect (2h)
- Frontend Specialist (2h)
- Integration Specialist (2h)
- Testing QA (0.5h)

**Optional:**
- Data Analyst (if metrics review scheduled)

**Tasks:**
- Performance profiling
- Database query optimization
- Bundle size analysis
- User behavior insights

---

### Friday: Documentation & Planning Day
**Focus:** Docs, planning next week

**Active Agents:**
- Backend Architect (2h)
- Frontend Specialist (2h)
- Integration Specialist (1h)
- Testing QA (0.5h)

**Optional:**
- Documentation Manager (if updates needed)

**Tasks:**
- Update documentation
- Plan next week's priorities
- Review stakeholder feedback
- Knowledge sharing

---

## Success Metrics

### Agent-Level KPIs

#### Backend & Database Architect
- ✅ API response time: < 200ms (avg)
- ✅ Uptime: 99.9%+
- ✅ Query performance: < 100ms (complex queries)
- ✅ Webhook success rate: > 99%
- ✅ Zero critical data issues

#### Frontend UI/UX Specialist
- ✅ Lighthouse Performance: > 90
- ✅ Mobile usability: 100%
- ✅ Bundle size: < 200kB per page
- ✅ Accessibility score: > 95
- ✅ Component reusability: > 70%

#### Integration & Automation Specialist
- ✅ Webhook reliability: > 99%
- ✅ API uptime: > 99.5%
- ✅ Email delivery: > 95%
- ✅ ExerciseDB cache hit rate: > 80%
- ✅ Zero missed purchase events

#### Nutrition & Meal Planning Specialist
- ✅ Macro accuracy: ± 5%
- ✅ Meal variety: > 100 recipes
- ✅ Dietary coverage: 4 preferences
- ✅ AI substitution quality: > 85%
- ✅ Recipe authenticity: 100%

#### Workout & Exercise Specialist
- ✅ Exercise library: > 500 exercises
- ✅ Video quality: 100% working
- ✅ Program effectiveness: Progressive overload
- ✅ Home/Gym coverage: 100%
- ✅ Workout completion: > 70%

#### Testing & Quality Assurance
- ✅ Code coverage: > 80%
- ✅ Zero critical bugs
- ✅ Security vulnerabilities: 0 high/critical
- ✅ TypeScript errors: 0
- ✅ Performance regression: < 5%

### Project-Level KPIs

**User Experience:**
- Quiz completion rate: > 70%
- App retention (7-day): > 60%
- Daily active users: growth +10% MoM
- User satisfaction: > 4.5/5

**Technical Health:**
- Code quality: A grade (SonarQube)
- Test coverage: > 80%
- Build time: < 3 minutes
- Deploy frequency: > 5/week

**Content Quality:**
- Content accuracy: 100%
- Bulgarian translation quality: > 95%
- Recipe diversity: 100+ meals
- Exercise library: 500+ exercises

---

## Activation Protocols

### Emergency Activation
**Trigger:** Production outage, critical bug, security breach

**Immediate Response Team:**
1. Backend Architect (if database/API issue)
2. Frontend Specialist (if UI/rendering issue)
3. Integration Specialist (if third-party API issue)
4. Testing QA (for verification)

**Response Time:** < 30 minutes
**Resolution Time:** < 4 hours

---

### Feature Request Activation
**Trigger:** New feature approved by stakeholders

**Planning Phase (2-4 hours):**
1. Data Analyst: Research user need
2. Backend Architect: Database schema design
3. Frontend Specialist: UI/UX mockups
4. Documentation Manager: Spec document

**Implementation Phase (varies):**
- Core team + relevant specialists
- Follow collaboration patterns
- Regular check-ins

---

### Content Update Activation
**Trigger:** Seasonal change, new content batch

**Content Team:**
1. Nutrition Specialist OR Workout Specialist
2. Content Creator (Bulgarian review)
3. Backend Architect (data upload)
4. Frontend Specialist (UI adjustments)

**Timeline:** 1-2 weeks

---

### Optimization Sprint Activation
**Trigger:** Performance degradation, user complaints

**Optimization Team:**
1. Data Analyst (identify bottlenecks)
2. Backend Architect OR Frontend Specialist (implement fixes)
3. Testing QA (validation)
4. Data Analyst (measure improvement)

**Timeline:** 3-5 days

---

## Agent Coordination Tools

### Communication Channels
- **Slack/Discord:** Real-time coordination
- **GitHub:** Code reviews, issues
- **Notion/Confluence:** Documentation
- **Jira:** Task tracking
- **Figma:** UI/UX collaboration

### Handoff Protocols

**Backend → Frontend:**
```
✅ API endpoint live and documented
✅ TypeScript types generated
✅ Example requests provided
✅ Error handling documented
```

**Frontend → Testing:**
```
✅ Component deployed to staging
✅ Test scenarios documented
✅ Known issues listed
✅ Rollback plan ready
```

**Testing → Documentation:**
```
✅ All tests passing
✅ Performance validated
✅ Security audit complete
✅ Ready for user-facing docs
```

---

## Appendix A: Agent Contact Matrix

| Agent | Collaborates Often With | Rarely Interacts With |
|-------|------------------------|----------------------|
| Backend Architect | Frontend, Integration, Testing | Content Creator, Docs |
| Frontend Specialist | Backend, Testing | Nutrition, Workout |
| Integration Specialist | Backend | Content Creator, Docs |
| Nutrition Specialist | Content Creator | Integration, Testing |
| Workout Specialist | Content Creator | Integration, Testing |
| Testing QA | Everyone | Content Creator |
| Quiz Specialist | Content Creator, Data Analyst | Integration |
| Data Analyst | Backend, Frontend | Nutrition, Workout |
| Content Creator | Nutrition, Workout, Quiz | Integration, Testing |
| Documentation Manager | Everyone (as needed) | - |

---

## Appendix B: Skill Development Paths

### Junior → Senior Progression

**Backend Architect:**
Junior → SQL optimization → API design → Distributed systems → Senior

**Frontend Specialist:**
Junior → React patterns → Performance → Architecture → Senior

**Integration Specialist:**
Junior → API basics → Security → Scalability → Senior

---

## Appendix C: Tool Stack by Agent

### Backend Architect
- Supabase Studio
- Postman/Insomnia
- pgAdmin
- DataGrip
- SQL query analyzers

### Frontend Specialist
- React DevTools
- Chrome DevTools
- Lighthouse
- Figma
- Tailwind CSS IntelliSense

### Integration Specialist
- Webhook.site
- ngrok
- API monitoring tools
- Postman

### Nutrition Specialist
- Macro calculators
- Recipe databases
- Gemini AI playground

### Workout Specialist
- ExerciseDB explorer
- Video editing tools
- Bulgarian dictionary

### Testing QA
- Jest/Vitest
- Playwright
- Lighthouse CI
- Security scanners

---

## Version History

**v1.0** (2025-11-13)
- Initial workforce structure
- 10 specialized agents defined
- Collaboration patterns established
- Time allocation matrix created

---

**Document Owner:** Backend Architect
**Review Frequency:** Quarterly
**Next Review:** 2025-02-13

---

*This workforce structure is a living document. Update as the project evolves and new needs emerge.*
