import nodemailer from "nodemailer";
import prisma from "./prisma";

// Creates (or replaces) a 6-digit OTP valid for 10 minutes and emails it.
// A new email gets a placeholder user, which the signup flow later completes.
export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: "" },
    select: {
      id: true,
    },
  });

  await prisma.oTP.upsert({
    where: { userId: user.id },
    update: { code: otp, expiresAt },
    create: { userId: user.id, code: otp, expiresAt },
  });
  console.log(`OTP for ${email}: ${otp}`);

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your One-Time Password",
      html: `
          <h1>Your One-Time Password</h1>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This code is valid for 10 minutes.</p>
        `,
    });
  } else {
    console.warn("Email credentials missing. Skipping email sending. Use OTP from console.");
  }
}

type OtpCheck = { ok: true; userId: string } | { ok: false; message: string };

// Checks an OTP without using it up, so a later step can present it again.
// Expired codes are deleted.
export async function checkOtp(email: string, otp: string): Promise<OtpCheck> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      otp: {
        select: {
          code: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user || !user.otp) {
    return { ok: false, message: "Invalid or expired OTP" };
  }

  if (new Date() > user.otp.expiresAt) {
    await prisma.oTP.delete({ where: { userId: user.id } });
    return { ok: false, message: "OTP has expired" };
  }

  if (otp !== user.otp.code) {
    return { ok: false, message: "Invalid OTP" };
  }

  return { ok: true, userId: user.id };
}
