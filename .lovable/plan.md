

## Plan: Improve Logo and Platform-Wide Responsiveness

### 1. Enhanced Logo
**Current**: Simple gradient square with Sparkles icon and plain text "AITD Events".

**Improvement**: Create a more distinctive, layered logo with:
- Stacked/overlapping gradient shapes (like a stylized "A" mark) with inner glow animation
- Better typography hierarchy: "AITD" bold + "Events" in accent gradient
- Subtle hover animation (scale + glow pulse)
- Apply consistently to Navbar, Footer, and any other logo instances

### 2. Navbar Responsiveness Fixes
- Increase breakpoint from `md` (768px) to `lg` (1024px) for desktop nav — 6 links + auth buttons overflow on tablets
- Reduce nav link padding on medium screens
- Add `About` link to mobile nav
- Shrink logo text on small screens

### 3. Page-Level Responsive Fixes

**HeroSection**: Already decent. Reduce padding on mobile (`py-12` instead of `py-20`), constrain badge text.

**Dashboard** (`340 lines`):
- Stats grid: ensure `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` pattern
- Leaderboard + activity feed: stack on mobile (`lg:grid-cols-3` -> `flex-col lg:flex-row`)
- Quick actions: responsive grid

**Learning** (`248 lines`):
- Course cards grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Tab triggers: scrollable on mobile (wrap `TabsList` with `overflow-x-auto`)
- Search bar: full-width on mobile

**Games** (`176 lines`):
- Game cards grid responsive
- Stats bar: wrap on small screens

**Mentorship** (`231 lines`):
- Mentor cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Dialog content: full-width on mobile with proper padding

**About**:
- Team grid, stats, values sections all need responsive grid adjustments

**Footer**:
- Already uses `md:grid-cols-2 lg:grid-cols-5` — good. Minor tweak: reduce `py-16` to `py-10` on mobile.

### 4. Global Responsive Utilities
- Add responsive container padding: reduce from `padding: 2rem` to `1rem` on mobile in tailwind config
- Ensure all `text-4xl`/`text-5xl` headings use responsive sizing (`text-2xl sm:text-3xl lg:text-4xl`)

### Files to Edit

| File | Changes |
|------|---------|
| `src/components/layout/Navbar.tsx` | New logo component, `lg` breakpoint, mobile improvements |
| `src/components/layout/Footer.tsx` | Updated logo, mobile padding |
| `src/components/home/HeroSection.tsx` | Mobile padding/spacing tweaks |
| `src/pages/Dashboard.tsx` | Responsive grids for stats, leaderboard, activity |
| `src/pages/Learning.tsx` | Responsive course grid, scrollable tabs |
| `src/pages/Games.tsx` | Responsive game cards grid |
| `src/pages/Mentorship.tsx` | Responsive mentor grid, mobile dialog |
| `src/pages/About.tsx` | Responsive team/stats/values grids |
| `tailwind.config.ts` | Adjust container padding for mobile (`1rem` on small screens) |

