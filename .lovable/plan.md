
## Plan: Seed Sample Data (6 events, 6 jobs, 6 blog posts)

There is one registered user who is already an admin: `fe3e04cf-662d-4f3e-8ff6-64912dd12dc8`. I'll use this UUID as `created_by` / `author_id` for all sample records.

### Data to insert

**Events (6)** — mix of `live`, `draft`, `completed`
1. AITD Hackathon 2026 — live, Workshop, March 2026
2. Web Dev Bootcamp — live, Workshop, April 2026
3. AI/ML Study Circle — live, Meetup, March 2026
4. Open Source Sprint — draft, Challenge, May 2026
5. Cloud Computing Workshop — live, Workshop, April 2026
6. AITD Annual Fest 2025 — completed, Festival, Dec 2025

**Jobs (6)** — mix of `active`, `draft`
1. Frontend Dev Intern — Google, active, internship, Bangalore
2. Backend Engineer — Razorpay, active, full_time, Mumbai
3. ML Research Intern — DRDO, active, internship, Delhi
4. UI/UX Designer — Zomato, draft, internship, Gurgaon
5. DevOps Engineer — Infosys, active, full_time, Pune
6. Android Dev Intern — Flipkart, active, internship, Bangalore

**Blog Posts (6)** — mix of `published: true` and `false`
1. "Getting Started with Open Source" — published, tags: open-source, beginners
2. "How to Ace Your Internship Hunt" — published, tags: career, internship
3. "Building with AI: A Student's Guide" — published, tags: ai, ml, students
4. "Web3 for Beginners" — draft (unpublished), tags: web3, blockchain
5. "AITD Hackathon 2026 Recap" — published, tags: hackathon, aitd
6. "Why Every CS Student Should Know Docker" — draft (unpublished), tags: devops, docker

### Implementation

**Single SQL migration** that:
- Inserts all 6 events with varied statuses and dates
- Inserts all 6 jobs with varied statuses and types
- Inserts all 6 blog posts with varied published states

No code changes needed — the admin pages already support listing, editing, and deleting these records. The public-facing Events and Jobs pages will immediately display the `live`/`active` ones once the data is inserted.

### What this enables you to test
- `/events` — shows 5 live events (Workshop filter, search, RSVP)
- `/jobs` — shows 5 active jobs (type + location filters)
- `/admin/events` — all 6 events (status badges, delete)
- `/admin/jobs` — all 6 jobs
- `/admin/blog` — all 6 posts (published toggle)
- `/admin` dashboard — stat cards update with real counts
