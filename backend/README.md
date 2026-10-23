# HealthCare+ Backend

The HealthCare+ API server. It's a Next.js 14 application that contains **only API routes** (no pages), and it's the only part of the system that holds secrets or talks to the database.

It is responsible for:

- **Data:** PostgreSQL through Prisma (`prisma/schema.prisma`)
- **Login:** NextAuth with email and password (verified by an emailed OTP), Google and GitHub; sessions are JWT cookies
- **Payments:** Razorpay orders and payment-signature checks
- **Email:** OTP codes, booking confirmations and prescriptions, sent through Gmail SMTP (Nodemailer)
- **AI chat:** calls Google Gemini for the health assistant
- **Video calls:** issues ZEGOCLOUD tokens, so the ZEGOCLOUD secret never reaches browsers

## How requests arrive

Browsers don't call this server directly. The frontend forwards every `/api/*` request here (see `frontend/next.config.mjs`), so as far as browsers and OAuth providers are concerned, the API lives at the **frontend's** URL. That's why `NEXTAUTH_URL` and `FRONTEND_URL` are set to the frontend's address.

## Folder structure

```
backend/
├── app/
│   ├── route.ts          Status message at the root address (http://localhost:4000)
│   └── api/              One folder per endpoint, each with a route.ts
├── lib/
│   ├── auth.ts           NextAuth setup: providers, JWT and session callbacks
│   ├── prisma.ts         Shared Prisma client
│   ├── mail.ts           Booking-confirmation and prescription emails
│   ├── otp.ts            Create, email and check one-time passwords
│   └── zego.ts           ZEGOCLOUD video-call token generation
├── prisma/
│   ├── schema.prisma     Database schema
│   ├── migrations/       Migration history
│   ├── seed-real.js      Loads real Uttarakhand hospitals and their departments
│   └── seed-demo-users.js  One demo login per role (development databases only)
├── types/                Type declarations
├── middleware.ts         Role checks for /api/appointments/* and /api/super-admin/*
└── next.config.mjs
```

## Access control

There are two layers:

1. **`middleware.ts`** runs before matching routes and answers with JSON errors instead of redirects:
   - `/api/appointments/*` requires a `PATIENT`.
   - `/api/super-admin/*` requires a `SUPER_ADMIN`.
   - It returns `401` when not signed in and `403` for the wrong role.
2. **Inside each route**, `getServerSession(authOptions)` loads the user, and the route checks their role and that the data belongs to them (for example, the hospital admin's own hospital, or the doctor's own appointments).

## API reference

All routes are under `/api`. The root address itself (`GET /`) only returns a short status message that points to the website.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET, POST | `/auth/[...nextauth]` | public | NextAuth: sign-in, sign-out, session, OAuth callbacks |
| POST | `/auth/otp` | public | Email a 6-digit OTP, valid for 10 minutes (creates a placeholder account for a new email) |
| POST | `/auth/verify-otp` | public, needs a valid OTP | With `type: "verification"`, checks the OTP. Otherwise sets the account password; the OTP is required again and is then used up |
| GET | `/hospitals` | public | Approved hospitals |
| GET | `/hospitals/nearby` | public | Hospitals near `?lat=&lng=`, with an optional `radius` (km) and `governmentOnly` filter |
| GET | `/hospitals/[id]/departments` | public | A hospital's departments (services) |
| GET | `/departments/[id]/slots` | public | Free time slots for a department on `?date=` |
| GET | `/public/data` | public | Hospitals, services, doctors or slots for the booking form (`?type=`) |
| POST | `/hospital/register` | public | Submit a hospital application |
| GET, POST | `/ambulances` | public | List approved ambulances (filter by region, availability, hospital); register an ambulance |
| POST | `/chat` | public | Health assistant reply from Gemini |
| GET | `/consultation/token` | signed in | ZEGOCLOUD token for joining a video call |
| POST | `/appointments` | `PATIENT` | Create an appointment |
| POST | `/appointments/create` | `PATIENT` | Create an appointment and its Razorpay order |
| GET | `/appointments/[id]` | `PATIENT` (own only) | Appointment details |
| POST | `/payment/initiate` | signed in | Create a pending appointment and its Razorpay order |
| POST | `/payment/verify` | public, needs Razorpay signature | Verify a payment, confirm the appointment and email the confirmation |
| GET | `/doctor/workspace/appointments` | doctor account | The signed-in doctor's appointments |
| POST | `/doctor/workspace/[appointmentId]/timer` | doctor account | Start or stop the consultation timer (`action: START \| STOP`) |
| POST | `/doctor/workspace/[appointmentId]/prescription` | doctor account | Save a prescription and email it to the patient |
| GET, PATCH | `/admin/appointments` | `HOSPITAL_ADMIN`, `HOSPITAL_STAFF` | List and update the hospital's appointments |
| GET, POST, DELETE | `/admin/slots` | `HOSPITAL_ADMIN`, `HOSPITAL_STAFF` | Manage the hospital's time slots |
| GET, POST | `/admin/doctors` | `HOSPITAL_ADMIN` | Manage the hospital's doctors |
| GET, POST, DELETE | `/admin/services` | `HOSPITAL_ADMIN` | Manage services and pricing |
| GET, POST | `/admin/staff` | `HOSPITAL_ADMIN` | List staff; make an existing account `HOSPITAL_STAFF` or `DOCTOR` |
| GET, POST | `/super-admin` | `SUPER_ADMIN` | Pending hospital applications; approve or reject (approval makes the applicant `HOSPITAL_ADMIN`) |
| GET, POST | `/super-admin/ambulances` | `SUPER_ADMIN` | Pending ambulance registrations; approve or reject |

## Database

The schema is in `prisma/schema.prisma`. Main models: `User` (with a `Role`), `OTP`, `Hospital`, `Service` (a hospital department), `Doctor`, `TimeSlot`, `Appointment`, `Prescription` and `Ambulance`; there are also `ChatSession`, `ChatMessage` and `ChatReport` models.

> The migration `20261023123349_add_missing_schema_changes` brings the migration history in line with `schema.prisma`. Before it, the migrations were missing the `Prescription` and chat tables, the `HOSPITAL_STAFF` and `DOCTOR` roles, and several hospital and appointment columns. If a database already has those changes (for example, it was set up with `prisma db push`), mark the migration as applied instead of running it: `npx prisma migrate resolve --applied 20261023123349_add_missing_schema_changes`

## Demo accounts (development only)

`npm run db:seed:demo` creates one ready-to-use login per role, so you can try every part of the app without going through signup and approvals:

| Email | Role |
|---|---|
| `superadmin@healthcareplus.test` | `SUPER_ADMIN` |
| `hospitaladmin@healthcareplus.test` | `HOSPITAL_ADMIN` |
| `staff@healthcareplus.test` | `HOSPITAL_STAFF` |
| `doctor@healthcareplus.test` | `DOCTOR` |
| `patient@healthcareplus.test` | `PATIENT` |

- All five accounts share one password. It's set by `DEMO_PASSWORD` at the top of `prisma/seed-demo-users.js`, and the script prints it when it finishes.
- The hospital admin, staff and doctor accounts belong to an approved **HealthCare+ Demo Hospital**, which the script creates. The doctor account is linked to a doctor record there.
- Running the script again resets these accounts (password, role, hospital) without creating duplicates.
- The password is public, so the script refuses to run when `NODE_ENV=production`. It also stops if `DATABASE_URL` points anywhere other than your own machine, unless you add `--remote` (`npm run db:seed:demo -- --remote`). Only do that for a development database.

## Environment variables

Copy `.env.example` to `.env` (Prisma reads `.env`, not `.env.local`):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string used by the app (the pooled URL if you use a connection pooler) |
| `DIRECT_URL` | yes | Direct PostgreSQL connection used by migrations; same as `DATABASE_URL` without a pooler |
| `NEXTAUTH_URL` | yes | Public URL of the **frontend**, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | yes | Long random string; must match the frontend's |
| `FRONTEND_URL` | yes | Public URL of the frontend, used in links we send (video call links) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | for Google sign-in | Redirect URI: `<NEXTAUTH_URL>/api/auth/callback/google` |
| `GITHUB_ID`, `GITHUB_SECRET` | for GitHub sign-in | Callback URL: `<NEXTAUTH_URL>/api/auth/callback/github` |
| `EMAIL_USER`, `EMAIL_PASS` | for email | Gmail address and App Password. Without them, OTPs are only printed to the console |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | yes, even to build | Razorpay keys; the client is created when the routes load, so builds fail without them |
| `GEMINI_API_KEY` | for chat | Google Gemini API key |
| `ZEGO_APP_ID`, `ZEGO_SERVER_SECRET` | for video calls | ZEGOCLOUD app ID and 32-character server secret |

> **Rotate the ZEGOCLOUD secret.** An earlier version hard-coded it in the frontend, so the old value is in the git history. Generate a new one in the ZEGOCLOUD console and put it in `ZEGO_SERVER_SECRET`.

## Scripts

Run inside `backend/`, or use the root scripts to run both apps together:

| Command | What it does |
|---|---|
| `npm install` | Install dependencies and generate the Prisma client |
| `npm run dev` | Development server on http://localhost:4000 |
| `npm run build` | Production build (needs the Razorpay keys set) |
| `npm run start` | Serve the production build on port 4000 |
| `npm run db:migrate` | Apply migrations in development (`prisma migrate dev`) |
| `npm run db:deploy` | Apply migrations in production (`prisma migrate deploy`) |
| `npm run db:seed` | Load the Uttarakhand hospital data |
| `npm run db:seed:demo` | Create one demo login per role (development databases only, see [Demo accounts](#demo-accounts-development-only)) |
| `npm run db:studio` | Browse and edit the database in Prisma Studio |

If you use npm 11 or newer and `bcrypt` fails to load, approve its install script and reinstall:

```bash
npm install-scripts approve bcrypt @prisma/client @prisma/engines prisma
npm install
```
