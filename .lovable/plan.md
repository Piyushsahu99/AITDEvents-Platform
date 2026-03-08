

## Setup Plan: Admin Access

There are **two prerequisites** before you can access `/admin`:

### 1. Authentication page needs to be built
The `/auth` route currently shows a placeholder. You need a real signup/login page so you can create an account. This requires building:
- A sign-up form (email + password + full name) using Supabase Auth
- A login form
- Redirect logic after successful auth

### 2. Assign admin role
After creating an account and signing in, you'll need your user assigned the admin role. I can insert the role record for you once you've signed up — or we can seed it via SQL after you provide your email.

### Proposed Implementation

**Build the Auth page** (`src/pages/Auth.tsx`):
- Tab-based UI with Sign In / Sign Up tabs
- Sign Up: email, password, full name fields → calls `supabase.auth.signUp()` with full_name in metadata
- Sign In: email, password → calls `supabase.auth.signInWithPassword()`
- On success, redirect to `/` (or `/admin` if coming from there)
- Update `src/App.tsx` to use the new Auth page instead of the placeholder

**After you sign up**, I'll assign the admin role to your account so you can access `/admin`.

### Notes
- The `handle_new_user` trigger will auto-create your profile on signup
- Email confirmation is enabled by default — would you like me to disable auto-confirm so you can sign in immediately, or keep the default email verification?

