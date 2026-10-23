import nodemailer from "nodemailer";
import prisma from "./prisma";
import { MINUTE, RateLimitError, consume, reset, waitText } from "./rate-limit";

const MAX_WRONG_TRIES = 5;

// Creates (or replaces) a 6-digit OTP valid for 10 minutes and emails it.
// A new email gets a placeholder user, which the signup flow later completes.
// At most 3 codes per email per 15 minutes; throws RateLimitError beyond that.
export async function sendOtp(email: string) {
  const key = email.trim().toLowerCase();
  const { retryAfterSeconds } = consume(`otp-send:${key}`, 3, 15 * MINUTE);
  if (retryAfterSeconds) {
    throw new RateLimitError(`Too many codes requested. Please try again in ${waitText(retryAfterSeconds)}.`, retryAfterSeconds);
  }

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
  reset(`otp-fail:${key}`); // a new code gets a fresh set of tries

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
    // Development fallback only: with no email settings, the code goes to the server console.
    console.warn(`Email settings missing, so the OTP was not emailed. OTP for ${email}: ${otp}`);
  }
}

type OtpCheck = { ok: true; userId: string } | { ok: false; message: string };

// Checks an OTP without using it up, so a later step can present it again.
// Expired codes are deleted, and so is a code after 5 wrong tries, so it can't be guessed.
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
    const key = `otp-fail:${email.trim().toLowerCase()}`;
    if (consume(key, MAX_WRONG_TRIES, 10 * MINUTE).count >= MAX_WRONG_TRIES) {
      await prisma.oTP.deleteMany({ where: { userId: user.id } });
      reset(key);
      return { ok: false, message: "Too many wrong codes. Please request a new one." };
    }
    return { ok: false, message: "Invalid OTP" };
  }

  return { ok: true, userId: user.id };
}
