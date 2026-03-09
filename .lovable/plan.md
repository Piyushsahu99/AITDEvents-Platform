

## Enhanced Admin Portal Plan

### Current State
- 6 admin pages: Dashboard (basic stats), Events, Jobs, Blog, Games, Users
- AdminLayout with sidebar navigation and role-based access guard
- ContentTable reusable component with edit/delete actions
- StatsCard component for metrics
- All tables have proper RLS with admin `has_role` checks

### What We'll Build

**1. Enhanced Admin Dashboard (`AdminDashboard.tsx` rewrite)**
- Analytics charts using Recharts (already installed): line chart for signups over time, bar chart for content by type, pie chart for event categories
- Use the existing `ChartContainer`/`ChartTooltip` from `src/components/ui/chart.tsx`
- Quick-action cards linking to create events/jobs/posts
- Recent activity feed (latest 5 events, posts, RSVPs combined)

**2. New Admin Analytics Page (`/admin/analytics`)**
- User growth trend (line chart from profiles `created_at` grouped by week)
- Event RSVPs over time (bar chart from `event_rsvps`)
- Content distribution (pie chart: events vs jobs vs blogs)
- Top events by RSVPs, top blog posts by views
- All data fetched via Supabase queries on existing tables

**3. Enhanced Admin Users Page (`AdminUsers.tsx` rewrite)**
- CRM-style view: search/filter by name, college, level
- User detail drawer showing profile info, points, level, role
- Ability to promote/demote users (insert/delete from `user_roles`)
- Sort by points, level, join date

**4. New Admin Settings Page (`/admin/settings`)**
- Platform stats summary
- Admin role management: view all admins, add new admin by selecting from user list

**5. Sidebar & Routing Updates**
- Add "Analytics" and "Settings" links to `AdminSidebar.tsx`
- Add routes `/admin/analytics` and `/admin/settings` in `App.tsx`

### Files to Create/Edit

| File | Action |
|------|--------|
| `src/pages/admin/AdminDashboard.tsx` | Rewrite with charts + activity feed |
| `src/pages/admin/AdminAnalytics.tsx` | New analytics page |
| `src/pages/admin/AdminUsers.tsx` | Rewrite with CRM features |
| `src/pages/admin/AdminSettings.tsx` | New settings page |
| `src/components/admin/AdminSidebar.tsx` | Add Analytics, Settings links |
| `src/App.tsx` | Add 2 new admin routes |

### No Database Changes Needed
All analytics are derived from existing tables (profiles, events, event_rsvps, blog_posts, jobs, game_sessions, user_roles). Role management uses existing `user_roles` table with admin RLS.

