import { NextResponse } from 'next/server';
import { sendOtp } from '@/lib/otp';
import { RateLimitError } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await sendOtp(email);

    return NextResponse.json({ message: 'OTP generated (checked console if no email received)!' }, { status: 200 });

  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { message: error.message },
        { status: 429, headers: { 'Retry-After': String(error.retryAfterSeconds) } }
      );
    }
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 });
  }
}
