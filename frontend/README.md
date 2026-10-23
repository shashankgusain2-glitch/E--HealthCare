# HealthCare+ Frontend

The HealthCare+ website: every page that patients, hospital staff, doctors and super admins see. It's a Next.js 14 (App Router) application with **no database access and no secrets**. All data comes from the [backend](../backend/README.md) through `/api/*`.

## How it talks to the backend

- Pages call relative URLs such as `fetch("/api/hospitals")`.
- `next.config.mjs` forwards every `/api/*` request to `BACKEND_URL` (default `http://localhost:4000`). To the browser the API is on the same origin as the website, so the session cookie is sent automatically and no CORS setup is needed.
- Login state comes from NextAuth's React helpers (`useSession`, `signIn`, `signOut`), which call `/api/auth/*` through the same forwarding.

## Page access (`middleware.ts`)

Before a protected page loads, `middleware.ts` reads the session cookie and checks the user's role:

| Path | Who can open it |
|---|---|
| `/appointments/*` | `PATIENT` |
| `/HospitalAdminPanel` | `HOSPITAL_ADMIN` or `HOSPITAL_STAFF` linked to a hospital |
| `/super-admin/*` | `SUPER_ADMIN` |
| `/doctor/*` | `DOCTOR` |
| `/consultation` | any signed-in user |

Visitors who aren't signed in go to `/login` and come back to the page afterwards. Signed-in users with the wrong role see `/unauthorized`. These checks only decide which pages show; the backend enforces access separately on every API call.

## Folder structure

```
frontend/
├── app/                    Routes (Next.js App Router)
│   ├── (pages)/            Feature pages; "(pages)" is only a grouping folder and isn't part of the URL
│   ├── services/           Service information pages
│   ├── layout.tsx          Root layout: fonts, session provider, toasts, analytics
│   ├── page.tsx            Home page
│   ├── globals.css         Tailwind CSS and theme variables
│   └── constants.ts        Static home-page content (services, featured doctors)
├── components/
│   ├── ui/                 shadcn/ui building blocks (button, dialog, table, ...)
│   ├── sections/           Home-page sections
│   ├── appointments/       Booking-flow pieces (progress bar, slot grid)
│   ├── map/                Leaflet hospital map (rendered in the browser only)
│   └── *.tsx               Feature components: navbar, footer, admin-panel tabs, video call, ...
├── hooks/                  Shared React hooks
├── lib/utils.ts            cn() helper for combining Tailwind classes
├── providers/              NextAuth SessionProvider wrapper
├── public/                 Images and icons
├── middleware.ts           Page access by role
└── next.config.mjs         Next.js settings, including the /api/* forwarding
```

## Pages

| URL | Purpose |
|---|---|
| `/` | Home page |
| `/login`, `/signup` | Sign in (email and password, Google, GitHub); sign up with an emailed OTP |
| `/appointments/hospitals` → `/appointments/hospitals/[hospitalId]/departments` → `.../[serviceId]/slots` → `/appointments/checkout` → `/appointments/confirmation/[id]` | Main booking flow, with Razorpay payment |
| `/appointment-book` | Single-page booking form |
| `/hospitals-near-me` | Map of hospitals near the user |
| `/ambulances`, `/ambulances/register` | Ambulance directory and registration |
| `/consultation?roomID=...` | Video consultation room (ZEGOCLOUD) |
| `/chat` | AI health assistant with voice input and spoken replies |
| `/hospital-register` | Hospital application form |
| `/HospitalAdminPanel` | Hospital admin and staff panel |
| `/doctor/workspace` | Doctor workspace: queue, timer, prescriptions, brain tumour prediction |
| `/super-admin/dashboard` | Hospital and ambulance approvals |
| `/services`, `/services/*` | Service information pages |
| `/contact-us`, `/privacy-policy`, `/terms-and-conditions`, `/cancellation-policy`, `/shipping-policy` | Information pages |
| `/unauthorized` | Shown when a signed-in user lacks the required role |

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | in production | Backend base URL that `/api/*` is forwarded to. Defaults to `http://localhost:4000`. Baked into the production build, so rebuild after changing it. |
| `NEXTAUTH_URL` | yes | Public URL of this website, e.g. `http://localhost:3000`. Same value as in the backend. |
| `NEXTAUTH_SECRET` | yes | Must be **identical** to the backend's, so `middleware.ts` can read the session cookie. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | for payments | Razorpay **public** key id used by the checkout popup (same as the backend's `RAZORPAY_KEY_ID`). |

The frontend holds no other keys: Gemini, ZEGOCLOUD, Razorpay secrets and email credentials all live in the backend.

## Scripts

Run inside `frontend/`, or use the root scripts to run both apps together:

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3000 |

The backend must be running for any page that loads data or handles login.

## External service

`components/BrainTumorPrediction.tsx` (used in the doctor workspace) posts MRI images straight from the browser to `http://127.0.0.1:8000/predict`, a separate ML service that isn't in this repository. See the [root README](../README.md#external-services).
