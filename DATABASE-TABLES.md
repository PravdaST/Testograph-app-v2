# Testograph-v2 Database Tables

## Active Tables Used by testograph-v2 Mobile App

### Core User Data
| Table | Uses | Description |
|-------|------|-------------|
| `quiz_results_v2` | 20+ | Main quiz results, user profiles, program data, dietary_preference, program_start_date |

### Activity Tracking
| Table | Uses | Description |
|-------|------|-------------|
| `workout_sessions` | 22 | Completed workout sessions |
| `workout_exercise_sets` | 6 | Individual exercise sets within workouts |
| `meal_completions` | 15 | Daily meal tracking |
| `sleep_tracking` | 15 | Sleep quality and duration |
| `testoup_tracking` | 16 | TestoUP supplement intake (morning/evening) |
| `water_tracking` | 2 | Water intake tracking |

### Progress & Scores
| Table | Uses | Description |
|-------|------|-------------|
| `daily_progress_scores` | 6 | Daily calculated progress scores |
| `user_daily_completion` | 4 | Daily completion status summary |
| `user_progress` | 2 | Overall user progress |
| `body_measurements` | 3 | Weight, body measurements |
| `progress_photos` | 4 | Before/after progress photos |

### TestoUP / Shopify
| Table | Uses | Description |
|-------|------|-------------|
| `testoup_inventory` | 17 | User's capsule balance |
| `testoup_purchase_history` | 4 | Completed Shopify purchases |
| `pending_orders` | 4 | COD orders awaiting delivery |

### AI Coach
| Table | Uses | Description |
|-------|------|-------------|
| `coach_messages` | 5 | AI coach conversation history |

### Program & Exercises
| Table | Uses | Description |
|-------|------|-------------|
| `user_programs` | 4 | User's active programs |
| `user_exercise_substitutions` | 3 | Custom exercise replacements |
| `exercise_alternatives` | 1 | Available exercise alternatives |
| `meal_substitutions` | 3 | Meal ingredient substitutions |

### Feedback
| Table | Uses | Description |
|-------|------|-------------|
| `feedback_submissions` | 3 | User feedback forms |
| `feedback_responses` | 1 | Admin responses to feedback |

### Quiz Flow (Legacy)
| Table | Uses | Description |
|-------|------|-------------|
| `quiz_results` | 3 | OLD - fallback only, use quiz_results_v2 |
| `quiz_sessions` | 2 | Quiz session tracking |
| `quiz_responses` | 2 | Individual quiz answers |

---

## Tables NOT Used by testograph-v2

These exist in Supabase but are NOT referenced in testograph-v2 code:

### SEO/Keywords (Admin Tool)
- `gsc_auth_tokens`
- `gsc_keyword_performance`
- `keyword_cluster_members`
- `keyword_clusters`
- `keyword_content_gaps`
- `keyword_content_integration_stats`
- `keyword_difficulty`
- `keyword_usage`
- `onpage_seo_analysis`
- `serp_analysis`
- `target_keywords`
- `content_keyword_mapping`

### Gamification (Not Implemented)
- `challenges`
- `user_challenges`
- `leaderboards`
- `rewards`
- `user_rewards`
- `user_achievements`
- `user_streaks`

### Admin Panel Only
- `admin_audit_logs`
- `admin_users`
- `chat_sessions` (admin view of coach chats)
- `chat_messages`
- `email_logs`
- `email_subscribers`
- `email_templates`
- `funnel_events`
- `funnel_sessions`

### Affiliates
- `affiliate_applications`
- `affiliate_clicks`
- `affiliate_commissions`
- `affiliate_materials`
- `affiliate_orders`
- `affiliates`

### Content Management
- `blog_posts`
- `learn_guides_stats`

### Deprecated (Can be dropped)
- `users` - DEPRECATED: All fields migrated to quiz_results_v2 (dietary_preference, program_start_date)

### Other
- `profiles` - Supabase Auth managed
- `oauth_state_tokens`
- `received_emails_cache`
- `programs` - static program definitions?
- `exercises` - exercise library
- `exercise_difficulty`
- `exercise_tags`
- `meals` - meal library
- `meal_ingredients`
- `meal_plan_weekly`
- `meal_tags`
- `meals_taken`
- `messages`
- `conversations`
- `supplements`
- `supplement_tags`
- `supplements_taken`
- `sleep_recommendations`
- `sleep_tags`
- `user_activations`
- `user_checkins`
- `user_ingredient_checklist`
- `user_meal_goals`
- `user_photo_stats`
- `user_score_history`
- `quiz_leads`

---

## Summary

**Actively Used by testograph-v2:** 23 tables
**Admin/Other purposes:** 50+ tables
**Potential cleanup candidates:** See "Gamification" section (empty tables)
**Deprecated (safe to drop):** `users` table - migrated to quiz_results_v2

---

## Migration Notes (2025-12-01)

### users table deprecated
All data from `users` table has been migrated to `quiz_results_v2`:
- `dietary_preference` - now in quiz_results_v2
- `program_start_date` - new column added to quiz_results_v2

To drop the `users` table, first run the migration:
```sql
-- See: supabase/migrations/add_program_start_date.sql
```

Then drop the table:
```sql
DROP TABLE IF EXISTS users CASCADE;
```
