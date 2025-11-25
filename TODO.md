# TODO - Testograph v2 Profile & Features Backlog

**Статус:** Активни задачи за подобрение на Profile page и общи функции
**Дата:** 2025-11-25
**Priority Levels:** 🔴 Critical | 🟡 Important | 🟢 Nice-to-Have

---

## 🔴 КРИТИЧНИ (Priority 1 - Must Have)

### 1. Change Password 🔐
**Статус:** ❌ Липсва
**Описание:** Няма начин да сменяш паролата от профила
**Критичност:** HIGH - Security issue
**Задачи:**
- [ ] Създай `/api/user/change-password` endpoint
  - Validate current password
  - Update password в Supabase Auth
  - Session validation
- [ ] Добави "Change Password" секция в Profile page
  - Input за current password
  - Input за new password
  - Input за confirm new password
  - Password strength indicator
- [ ] Error handling и validation
  - Минимум 8 symbols
  - Password match check
  - Current password verification

**Време:** ~2-3 hours

---

### 2. Change Email 📧
**Статус:** ❌ Липсва
**Описание:** Не можеш да промениш email адреса
**Критичност:** HIGH - User може да загуби достъп ако смени email provider
**Задачи:**
- [ ] Създай `/api/user/change-email` endpoint
  - Validate new email format
  - Check if email already exists
  - Send verification email към new email
  - Update в Supabase Auth + database tables
- [ ] Добави "Change Email" секция в Profile page
  - Current email display (non-editable)
  - New email input
  - Password confirmation за security
  - Verification flow UI
- [ ] Email verification process
  - Send verification link
  - Handle verification callback
  - Update all tables with new email

**Време:** ~4-5 hours

---

### 3. Email Verification Status ✉️
**Статус:** ❌ Липсва
**Описание:** Не показва дали email е verified
**Критичност:** MEDIUM-HIGH - Security и trust
**Задачи:**
- [ ] Добави verification badge в Profile page
  - ✅ Verified icon (green checkmark)
  - ⚠️ Not Verified warning (yellow)
- [ ] "Resend Verification Email" бутон
  - Показва се само ако email NOT verified
  - Rate limiting (1 email per 5 min)
- [ ] Проверка на verification status
  - Get от Supabase Auth `email_confirmed_at`
  - Display в Hero section на Profile

**Време:** ~1-2 hours

---

### 4. Account Info Section ℹ️
**Статус:** ❌ Липсва
**Описание:** Липсва основна информация за account
**Критичност:** MEDIUM - Important for user context
**Задачи:**
- [ ] Добави Account Info card в Profile page
  - Account Created Date (от Supabase Auth `created_at`)
  - Last Login timestamp (от Supabase Auth `last_sign_in_at`)
  - Email verification status
  - Program Days (колко дни в програмата)
- [ ] API endpoint (или extend existing `/api/user/program`)
  - Return account metadata
- [ ] Design consistent с останалите cards

**Време:** ~1 hour

---

## 🟡 ВАЖНИ (Priority 2 - Should Have)

### 5. Progress Photo Storyboard 📸
**Статус:** ❌ Липсва (КРИТИЧЕН ПРОПУСК!)
**Описание:** Няма visual progress tracking със снимки на тялото
**Критичност:** HIGH - Това е ОСНОВНА функция за fitness app!
**Задачи:**
- [ ] Database schema
  - Създай `progress_photos` таблица
    - id, email, photo_url, date, weight, notes
- [ ] `/api/user/progress-photos` endpoint
  - GET - fetch all photos за user (sorted by date)
  - POST - upload new photo
  - DELETE - delete photo
- [ ] Supabase Storage bucket: `progress-photos`
- [ ] UI Component: ProgressPhotoGallery
  - Timeline view (chronological)
  - Before/After comparison slider
  - Upload photo button (camera + gallery)
  - Date picker за photo
  - Optional: weight input
  - Optional: notes field
- [ ] Интеграция в Profile page
  - Нова секция: "Progress Photos"
  - Grid layout 3 columns
  - Lightbox за full-screen view
- [ ] Feature: Compare Photos
  - Select 2 photos to compare side-by-side
  - Show date difference
  - Show weight difference

**Време:** ~6-8 hours

---

### 6. Program History 📚
**Статус:** ❌ Липсва
**Описание:** Ако user е правил quiz преди, не вижда старите програми
**Критичност:** MEDIUM - Useful за users с multiple cycles
**Задачи:**
- [ ] Query history от `quiz_results_v2`
  - All completed programs
  - Group by program cycle
- [ ] UI: Program History section
  - Expandable cards за всяка програма
  - Show: category, dates, completion rate
- [ ] Stats comparison
  - Compare results between programs

**Време:** ~3-4 hours

---

### 7. Body Measurements Tracking 📏
**Статус:** ❌ Липсва
**Описание:** Липсва tracking на body measurements
**Критичност:** MEDIUM-HIGH - Важно за progress tracking
**Задачи:**
- [ ] Database: `body_measurements` таблица
  - id, email, date, weight, body_fat_pct, waist, chest, arms, legs
- [ ] `/api/user/measurements` endpoint
  - GET - history
  - POST - add new measurement
  - DELETE - remove measurement
- [ ] UI Component: MeasurementsTracker
  - Input form за measurements
  - Date picker
  - History table
  - Charts за trend visualization
- [ ] Интеграция в Profile page
  - Нова секция под Stats
  - Line charts за weight/body fat trends

**Време:** ~5-6 hours

---

### 8. Export Data (GDPR Compliance) 💾
**Статус:** ❌ Липсва
**Описание:** Download на всички данни в JSON/CSV
**Критичност:** MEDIUM - GDPR requirement за EU users
**Задачи:**
- [ ] `/api/user/export-data` endpoint
  - Collect all user data from all tables
  - Format as JSON + CSV
  - Generate download link
- [ ] UI: Export button в Profile page
  - Modal с options (JSON/CSV)
  - Download progress indicator
  - Success confirmation
- [ ] Include всички tables:
  - quiz_results_v2
  - meal_completions
  - workout_sessions
  - sleep_tracking
  - testoup_tracking
  - feedback_submissions

**Време:** ~3-4 hours

---

### 9. Active Sessions Management 📱
**Статус:** ❌ Липсва
**Описание:** Виж всички активни сесии (devices), logout от всички
**Критичност:** MEDIUM - Security feature
**Задачи:**
- [ ] Query Supabase Auth sessions
  - Get all active sessions за user
  - Show device info (browser, OS)
  - Show last active timestamp
- [ ] UI: Active Sessions section
  - List all sessions
  - "Logout from this device" бутон
  - "Logout from all devices" бутон
- [ ] Implement logout logic
  - Revoke specific session
  - Revoke all sessions except current

**Време:** ~3-4 hours

---

## 🟢 NICE-TO-HAVE (Priority 3)

### 10. Achievements/Badges 🏆
**Статус:** ❌ Липсва
**Gamification за motivation:**
- [ ] 7 days streak badge
- [ ] 30 days completed badge
- [ ] 100% compliance badge
- [ ] Workout warrior badge
- [ ] Database: `achievements` table
- [ ] UI: Achievements showcase in Profile

**Време:** ~4-5 hours

---

### 11. Notification Settings 🔔
**Статус:** ❌ Липсва
**Push notifications control:**
- [ ] Toggle за workout reminders
- [ ] Toggle за meal reminders
- [ ] Toggle за TestoUp reminders
- [ ] Toggle за email notifications
- [ ] UI: Notifications section в Profile

**Време:** ~2-3 hours

---

### 12. Language Preference 🌍
**Статус:** ❌ Липсва (сега hardcoded на BG)
**EN/BG toggle:**
- [ ] i18n setup (next-intl или similar)
- [ ] Translate all strings
- [ ] Language selector в Profile
- [ ] Store preference в database

**Време:** ~8-10 hours (голяма задача)

---

### 13. Change Program Category 🔄
**Статус:** ❌ Липсва
**Смяна на energy → muscle без account delete:**
- [ ] "Change Program" бутон в Profile
- [ ] Retake quiz flow
- [ ] Keep history на старата програма
- [ ] Switch to new program

**Време:** ~3-4 hours

---

### 14. Contact Support / Help 💬
**Статус:** ❌ Липсва
**Support access:**
- [ ] Contact Support link
- [ ] Email support form
- [ ] FAQ section (може да е отделна page)
- [ ] In-app chat widget (optional)

**Време:** ~2-3 hours

---

### 15. Share Profile 📤
**Статус:** ❌ Липсва
**Social sharing:**
- [ ] Share achievements on social media
- [ ] Generate shareable progress image
- [ ] Referral program (invite friends)

**Време:** ~4-5 hours

---

### 16. Privacy Settings 🔒
**Статус:** ❌ Липсва
**Data privacy control:**
- [ ] Analytics opt-out toggle
- [ ] Data sharing preferences
- [ ] Privacy policy link

**Време:** ~2-3 hours

---

### 17. Two-Factor Authentication (2FA) 🔐
**Статус:** ❌ Липсва
**Extra security layer:**
- [ ] SMS-based 2FA
- [ ] Authenticator app (TOTP)
- [ ] Backup codes
- [ ] Enable/Disable toggle в Profile

**Време:** ~6-8 hours (complex feature)

---

## 📊 ПРИОРИТИЗИРАНА ROADMAP

### Sprint 1 (Week 1) - Critical Security & Account Features
**Focus:** Security и основна account функционалност
**Total effort:** ~12-15 hours

1. ✅ Change Password (2-3h)
2. ✅ Email Verification Status (1-2h)
3. ✅ Account Info Section (1h)
4. ✅ Change Email (4-5h)
5. ✅ Testing + Bug fixes (3-4h)

---

### Sprint 2 (Week 2) - Progress Tracking
**Focus:** Visual progress features
**Total effort:** ~14-18 hours

1. ✅ Progress Photo Storyboard (6-8h)
2. ✅ Body Measurements Tracking (5-6h)
3. ✅ Program History (3-4h)
4. ✅ Testing + Integration (3-4h)

---

### Sprint 3 (Week 3) - Data Management & Security
**Focus:** GDPR compliance и security
**Total effort:** ~11-14 hours

1. ✅ Export Data (GDPR) (3-4h)
2. ✅ Active Sessions Management (3-4h)
3. ✅ Achievements/Badges (4-5h)
4. ✅ Testing (2-3h)

---

### Sprint 4 (Week 4+) - Nice-to-Have Features
**Focus:** User experience enhancements
**Total effort:** ~varies

1. Notification Settings (2-3h)
2. Contact Support / Help (2-3h)
3. Change Program Category (3-4h)
4. Share Profile (4-5h)
5. Privacy Settings (2-3h)
6. Language Preference (8-10h) - може да е отделен sprint
7. Two-Factor Authentication (6-8h) - може да е отделен sprint

---

## 📝 NOTES

### Existing Features (Already Implemented ✅)
- Profile Picture (upload/delete)
- Name editing
- Goal editing
- Workout Location toggle
- Dietary Preference change
- Theme toggle (light/dark/system)
- Logout
- Delete Account
- User Stats (meals/workouts/sleep/TestoUp)
- Feedback History
- Quiz Score display
- Program Progress %

---

### Technical Considerations

**Database changes needed:**
- `progress_photos` table (Sprint 2)
- `body_measurements` table (Sprint 2)
- `achievements` table (Sprint 3)
- `user_preferences` table (Sprint 4) - за notifications, privacy settings

**Supabase Storage buckets needed:**
- `progress-photos` (Sprint 2)

**New API endpoints needed:**
- `/api/user/change-password` (Sprint 1)
- `/api/user/change-email` (Sprint 1)
- `/api/user/verify-email` (Sprint 1)
- `/api/user/progress-photos` (Sprint 2)
- `/api/user/measurements` (Sprint 2)
- `/api/user/export-data` (Sprint 3)
- `/api/user/sessions` (Sprint 3)

---

## 🚀 Getting Started

**Да започнем с Sprint 1:**
```bash
# 1. Change Password feature
- Създай /api/user/change-password endpoint
- Добави UI в Profile page
- Testing

# 2. Email Verification
- Проверка на verification status
- Resend verification email
- UI badge

# 3. Account Info
- Extend /api/user/program или създай /api/user/account-info
- Добави Account Info card
```

---

**Последно обновен:** 2025-11-25
**Автор:** Claude Code
**Статус:** Active backlog
