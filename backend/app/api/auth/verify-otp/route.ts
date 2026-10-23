import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkOtp } from '@/lib/otp';
import { hashPassword } from '@/lib/password';

// Signup happens in two calls, and both must carry the emailed OTP:
//   1. { email, otp, type: "verification" }     -> confirms the code
//   2. { email, otp, password }                 -> sets the password, then uses up the code
// Without the OTP check in step 2, anyone could set a new password on any account.
export async function POST(request: Request) {
  try {
    const { email, otp, type, password } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const check = await checkOtp(email, otp);
    if (!check.ok) {
      return NextResponse.json({ message: check.message }, { status: 400 });
    }

    if (type === "verification") {
      return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        email: email
      },data: {
        password: await hashPassword(password),
        isEmailVerified: true
      }
    })
    await prisma.oTP.delete({ where: { userId: check.userId } });

    if(!user){
      return NextResponse.json({ msg: "Failed to create account!" ,},{ status: 500 });
    }
    return NextResponse.json({ msg: "Successfully created account!" },{ status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
