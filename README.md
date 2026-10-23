# HealthCare+

HealthCare+ is a web platform for booking OPD (outpatient) appointments at verified government hospitals across Uttarakhand. Patients find a hospital, pick a department and a time slot, pay online and get a confirmation by email. Hospitals manage their doctors, slots and appointments from an admin panel, and doctors run consultations, in person or by video, from their own workspace.

The repository holds two separate applications:

| Folder | What it is | Details |
|---|---|---|
| [`frontend/`](frontend/) | The website: every page and UI component | [frontend/README.md](frontend/README.md) |
| [`backend/`](backend/) | The API server: database, login, payments, email, AI chat, video-call tokens | [backend/README.md](backend/README.md) |

## Features

**Patients**
- Book OPD appointments: choose a hospital, department and time slot, then pay with Razorpay. Paid bookings are confirmed automatically and a confirmation email is sent.
- Find nearby hospitals on a map, and browse or register ambulances.
- Join video consultations with a doctor (sign-in required).
- Ask the AI health assistant (Google Gemini) in English, Hindi, Garhwali or Kumaoni, by typing or speaking.
- Sign up with email and a one-time password (OTP), or sign in with Google or GitHub.

**Hospitals**
- Apply to join the platform; a super admin reviews the application.
- Hospital admin panel: staff, doctors, time slots, services and pricing, and appointments. Hospital staff get the appointments and time-slot sections.

**Doctors**
- Doctor workspace: the day's patient queue, a consultation timer, and prescriptions that are emailed to the patient.
- Brain tumour prediction from MRI images, served by a separate ML service (see [External services](#external-services)).

**Super admins**
- Dashboard to approve or reject hospital applications and ambulance registrations.

## Architecture

```
                  +-------------------------------+
   Browser ------>|  frontend/   Next.js  :3000   |
                  |  pages, UI, page access rules |
                  +---------------+---------------+
                                  |  every /api/* request is forwarded
                  +---------------v---------------+
                  |  backend/    Next.js  :4000   |----> PostgreSQL (Prisma)
                  |  API routes, NextAuth login,  |----> Razorpay, Gmail SMTP
                  |  payments, email, AI chat,    |----> Google Gemini
                  |  video-call tokens            |----> ZEGOCLOUD
                  +-------------------------------+

   Doctor workspace (browser) ----> ML service on 127.0.0.1:8000 (not in this repo)
```

- The browser only ever talks to the **frontend**. A rewrite in `frontend/next.config.mjs` forwards every `/api/*` request to the **backend**, so both apps share one origin: no CORS setup, and the NextAuth session cookie works for both.
- The **backend** is the only part that holds secrets or touches the database.
- Both apps read the same session cookie, so `NEXTAUTH_SECRET` must be identical in both.

## Tech stack

| Area | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 4, shadcn/ui (Radix UI), Framer Motion, Leaflet |
| Backend | Next.js 14 route handlers, NextAuth 4 (JWT sessions), Prisma 6 |
| Database | PostgreSQL |
| Integrations | Razorpay (payments), Nodemailer with Gmail SMTP (email), Google Gemini (chat), ZEGOCLOUD UIKit (video calls) |

## Getting started

### Prerequisites
- Node.js 18.17 or newer, with npm
- A PostgreSQL database
- Keys for the integrations you want to use (listed in each app's `.env.example`)

### 1. Install dependencies

From the repository root:

```bash
npm run install:all
```

This installs the root tooling, then `backend/` (which also generates the Prisma client) and `frontend/`.

> **npm 11 or newer:** npm may skip dependencies' install scripts until you approve them, which leaves `bcrypt` unbuilt. If login fails with a `bcrypt` error, run this inside `backend/` and install again:
> `npm install-scripts approve bcrypt @prisma/client @prisma/engines prisma`

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the values. Every variable is explained in the example files and in each app's README. Use the same `NEXTAUTH_SECRET` in both files.

### 3. Set up the database

```bash
npm run db:migrate --prefix backend
npm run db:seed --prefix backend
npm run db:seed:demo --prefix backend
```

The first command creates the tables by applying every migration in `backend/prisma/migrations/`. The second (optional) loads real Uttarakhand hospital data. The third (optional, development databases only) creates one demo login per role; see [Demo accounts](backend/README.md#demo-accounts-development-only).

> **Database set up earlier with `prisma db push`?** It may already contain what the `20261023123349_add_missing_schema_changes` migration adds, and applying it would then fail. Mark it as applied instead, from `backend/`: `npx prisma migrate resolve --applied 20261023123349_add_missing_schema_changes`

### 4. Run the apps

```bash
npm run dev
```

- Website: http://localhost:3000
- API: http://localhost:4000. You don't need to open it: the website reaches it through `/api/...`, and its own address only shows a short status message.

Either app can also run on its own; see its README.

## Root scripts

| Command | What it does |
|---|---|
| `npm run install:all` | Install dependencies for the root, backend and frontend |
| `npm run dev` | Start the backend (port 4000) and frontend (port 3000) together, in development mode |
| `npm run build` | Production build of the backend, then the frontend |
| `npm run start` | Start both production builds together |

## User roles

| Role | What they can use |
|---|---|
| `PATIENT` | Booking, their own appointments, video consultations, chat |
| `HOSPITAL_ADMIN` | The hospital admin panel (all sections) for their hospital |
| `HOSPITAL_STAFF` | The hospital admin panel: appointments and time slots |
| `DOCTOR` | The doctor workspace |
| `SUPER_ADMIN` | The super admin dashboard: hospital and ambulance approvals |

Every new account starts as a patient. When a super admin approves a hospital application, the applicant's account becomes that hospital's admin. Hospital admins turn existing accounts (by email) into staff or doctors. There is no screen for creating super admins; set the role directly in the database, for example with `npm run db:studio --prefix backend`.

On a development database you can skip all of this: `npm run db:seed:demo --prefix backend` creates one ready-to-use login for each role (see [Demo accounts](backend/README.md#demo-accounts-development-only)).

## External services

- **Brain tumour prediction (ML service).** The doctor workspace sends MRI images to `http://127.0.0.1:8000/predict`. That service is **not part of this repository**, and the address is hard-coded in `frontend/components/BrainTumorPrediction.tsx`. Because the doctor's browser calls it directly, it only works when the service runs on the doctor's own machine. The rest of the app works without it.

## Deployment

The project isn't deployed yet. When it is, deploy the two apps separately:

1. **Backend:** set all variables from `backend/.env.example`. `NEXTAUTH_URL` and `FRONTEND_URL` must be the frontend's public URL.
2. **Frontend:** set `BACKEND_URL` to the backend's URL **before building**, because the value is baked into the build. Use the same `NEXTAUTH_URL` and `NEXTAUTH_SECRET` as the backend.
3. **OAuth:** register the callback URLs on the frontend's domain: `https://<frontend-domain>/api/auth/callback/google` and `.../api/auth/callback/github`.

## Known issues

These existed before the restructure and are still open:

- **Rotate the ZEGOCLOUD server secret.** The old secret was hard-coded in the frontend and remains in the git history. The code now reads it from the backend's `.env`, but the old value should be replaced in the ZEGOCLOUD console.
- OTP codes are printed to the backend console (`backend/lib/otp.ts`), even when email sending is configured.
- There is no rate limiting: OTP attempts, logins and the public chat endpoint can be called without limit, and heavy chat use consumes the Gemini quota.
- Passwords are hashed with bcrypt cost factor 5; 10 or more is the usual recommendation.
- `GET /api/hospitals` doesn't read its request, so if the database is reachable during `npm run build`, Next.js 14 may cache the hospital list at build time. Adding `export const dynamic = "force-dynamic"` to that route would prevent it.
- The profile menu links to `/dashboard`, which doesn't exist.
- Production builds ignore TypeScript and ESLint errors (see each `next.config.mjs`); `frontend/components/theme-provider.tsx` has one TypeScript error.
