# Remaining work

Progress on the issues listed under [Known issues](README.md#known-issues), as of 23 October 2026.

## Done

| Issue | Fix | Checked |
|---|---|---|
| OTP codes printed to the backend console | Printed only when email isn't configured, as a development fallback (`backend/lib/otp.ts`) | Type-checked |
| Weak password hashing (bcrypt cost 5) | New passwords use cost 10; older hashes are upgraded at the next successful sign-in (`backend/lib/password.ts`) | Type-checked |
| Login showed raw database errors | One message, "Invalid email or password", for an unknown email or a wrong password, with similar timing. Database or email failures show "Sign-in is unavailable right now" (`backend/lib/auth.ts`) | Tested on the running app |
| No rate limiting | In-memory limits in `backend/lib/rate-limit.ts` (table below) | **Type-checked only, not yet tested on the running app** |

Rate limits. They live in the backend's memory, so they reset when it restarts and aren't shared between servers:

| What | Limit |
|---|---|
| Sending OTP codes | 3 per email per 15 minutes |
| Wrong OTP codes | After 5, the code is cancelled and a new one must be requested |
| Failed sign-ins | 10 per email, then a 15-minute wait |
| AI chat | 20 messages per visitor and 200 overall per 10 minutes |

The per-visitor chat limit uses the `X-Forwarded-For` address, which visitors can fake; the overall cap is the safety net.

## Still to do

The decisions for these are already made; they only need implementing.

1. **Test the rate limits** on the running app: each limit above, and that normal use isn't affected.
2. **Stop build-time caching of `GET /api/hospitals`.** Add `export const dynamic = "force-dynamic";` to `backend/app/api/hospitals/route.ts`, so a production build can't freeze the hospital list.
3. **Fix the "My Profile" link (404) by building a `/profile` page.**
   - Backend: `GET` and `PATCH /api/profile` for the signed-in user. Show name, email, phone and role; name and phone are editable.
   - Frontend: add `frontend/app/(pages)/profile/page.tsx`, change the profile-menu link in `frontend/components/Navbar.tsx` from `/dashboard` to `/profile`, and add `/profile` to the matcher in `frontend/middleware.ts` (signed-in users only).
4. **Turn on type checks in builds.** Delete the unused `frontend/components/theme-provider.tsx` (the only TypeScript error; nothing imports it), then remove `typescript.ignoreBuildErrors` from both `next.config.mjs` files. ESLint stays off, because it isn't set up yet.
5. **Update the README's Known issues** as these are finished.

## Only the project owner can do

- **Rotate the ZEGOCLOUD server secret.** The old one is in the public git history. Generate a new one in the ZEGOCLOUD console and put it in `backend/.env` as `ZEGO_SERVER_SECRET`.
- **Add the API keys** for the features you want to use (email, payments, AI chat, Google and GitHub sign-in). See `backend/.env.example` and `frontend/.env.example`.
