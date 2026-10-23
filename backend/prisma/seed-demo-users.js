// Creates one demo login per role, for local and development databases only.
// Safe to run more than once: existing demo accounts are reset to the values below.
//
//   npm run db:seed:demo                  database on this machine
//   npm run db:seed:demo -- --remote      hosted development database
//
// Never run this against production: the demo password below is public.
const { PrismaClient } = require('@prisma/client'); // also loads DATABASE_URL from .env
const bcrypt = require('bcrypt');

const DEMO_PASSWORD = 'Demo@1234';

// (`@type {const}` keeps 'SUPER_ADMIN', 'APPROVED', ... as Prisma enum values for type checking.)
const DEMO_ACCOUNTS = /** @type {const} */ ([
  { email: 'superadmin@healthcareplus.test', name: 'Demo Super Admin', role: 'SUPER_ADMIN' },
  { email: 'hospitaladmin@healthcareplus.test', name: 'Demo Hospital Admin', role: 'HOSPITAL_ADMIN' },
  { email: 'staff@healthcareplus.test', name: 'Demo Hospital Staff', role: 'HOSPITAL_STAFF' },
  { email: 'doctor@healthcareplus.test', name: 'Dr. Demo Doctor', role: 'DOCTOR' },
  { email: 'patient@healthcareplus.test', name: 'Demo Patient', role: 'PATIENT' },
]);

// Hospital admin, staff and doctor accounts all belong to this approved demo hospital.
const DEMO_HOSPITAL = /** @type {const} */ ({
  name: 'HealthCare+ Demo Hospital',
  registrationNumber: 'DEMO-0001',
  address: 'Demo Road',
  city: 'Dehradun',
  latitude: 30.3165,
  longitude: 78.0322,
  status: 'APPROVED',
  applicantEmail: 'hospitaladmin@healthcareplus.test',
});

const HOSPITAL_ROLES = ['HOSPITAL_ADMIN', 'HOSPITAL_STAFF', 'DOCTOR'];
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1', '[::1]', ''];

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

// Returns the database host, or stops if this doesn't look like a development database.
function checkTargetDatabase() {
  if (process.env.NODE_ENV === 'production') {
    fail('Refusing to run with NODE_ENV=production: the demo accounts have a public password.');
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    fail('DATABASE_URL is not set. Copy .env.example to .env and fill it in first.');
  }

  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    fail('DATABASE_URL is not a valid connection URL.');
  }

  if (!LOCAL_HOSTS.includes(host) && !process.argv.includes('--remote')) {
    fail(
      `DATABASE_URL points to "${host}", which is not a database on this machine.\n` +
      'If it is a development database, run again with --remote:\n' +
      '  npm run db:seed:demo -- --remote'
    );
  }

  return host || 'localhost';
}

async function main() {
  const host = checkTargetDatabase();
  const prisma = new PrismaClient();

  try {
    console.log(`Creating demo accounts in the database at ${host} ...`);
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    let hospital = await prisma.hospital.findFirst({
      where: { name: DEMO_HOSPITAL.name, registrationNumber: DEMO_HOSPITAL.registrationNumber },
    });
    hospital = hospital
      ? await prisma.hospital.update({ where: { id: hospital.id }, data: DEMO_HOSPITAL })
      : await prisma.hospital.create({ data: DEMO_HOSPITAL });

    const users = {};
    for (const account of DEMO_ACCOUNTS) {
      const data = {
        name: account.name,
        role: account.role,
        password: passwordHash,
        isEmailVerified: true, // otherwise login asks for an emailed OTP first
        hospitalId: HOSPITAL_ROLES.includes(account.role) ? hospital.id : null,
        doctorId: account.role === 'DOCTOR' ? undefined : null, // the doctor is linked below
      };
      users[account.role] = await prisma.user.upsert({
        where: { email: account.email },
        update: data,
        create: { email: account.email, ...data },
      });
    }

    // A doctor login needs a Doctor record, linked both ways as Staff Management does.
    const doctorUser = users.DOCTOR;
    const doctor = await prisma.doctor.upsert({
      where: { userId: doctorUser.id },
      update: { name: doctorUser.name, specialty: 'General Medicine', hospitalId: hospital.id },
      create: { name: doctorUser.name, specialty: 'General Medicine', hospitalId: hospital.id, userId: doctorUser.id },
    });
    await prisma.user.update({ where: { id: doctorUser.id }, data: { doctorId: doctor.id } });

    console.table(DEMO_ACCOUNTS.map(({ email, role }) => ({ email, role, password: DEMO_PASSWORD })));
    console.log(`Hospital accounts belong to "${hospital.name}". Sign in at /login.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
