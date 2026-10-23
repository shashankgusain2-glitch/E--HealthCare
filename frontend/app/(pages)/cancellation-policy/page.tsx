import React from 'react';
import { Heart, AlertTriangle } from 'lucide-react'; 

/**
 * Cancellation & Refund Policy Page
 * * IMPORTANT: This is a GENERIC TEMPLATE. It is NOT legal advice.
 * You MUST customize this policy to reflect your actual business practices
 * and have it reviewed by a legal professional.
 */
export default function CancellationPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">
        
        <div className="flex items-center gap-3 mb-6">
           <Heart className="h-6 w-6 text-primary" />
           <h1 className="text-3xl font-extrabold text-foreground">
             Cancellation & Refund Policy
           </h1>
        </div>
        
        <p className="mb-4 text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-lg flex gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>
            <strong>Disclaimer:</strong> This is a template. You must adjust the timeframes 
            (e.g., "24 hours") and amounts (e.g., "full refund", "processing fee") 
            to match your hospital's and payment gateway's policies.
          </span>
        </p>

        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            HealthCare+ ("we", "us") understands that plans can change. This policy
            outlines the procedures for canceling appointments and requesting refunds
            for services booked through our platform.
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">1. Appointment Cancellation</h2>
            <p>
              You may cancel your scheduled appointment through your patient dashboard
              on our platform or by contacting the hospital directly.
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                <strong>Full Refund:</strong> To receive a full refund of your appointment fee,
                cancellations must be made at least <strong>[24 hours]</strong> before the
                scheduled appointment time.
              </li>
              <li>
                <strong>Partial Refund / No Refund:</strong> Cancellations made within
                <strong>[24 hours]</strong> of the appointment time, or failure to attend
                the appointment (no-show), may not be eligible for a refund. 
                (Or: "...may be subject to a <strong>[Your Fee Amount]</strong> cancellation fee.")
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">2. How to Request a Refund</h2>
            <p>
              If your cancellation meets the criteria for a full or partial refund,
              the refund process will be initiated automatically.
            </p>
            <p>
              If you believe you are eligible for a refund that was not automatically
              processed, please contact our support team at [Your Support Email Address]
              within [7 days] of the appointment date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">3. Refund Processing</h2>
            <p>
              Once a refund is approved, it will be processed and credited back to
              the original method of payment (e.g., credit card, bank account)
              used for the booking.
            </p>
            <p>
              Please allow <strong>[5-7 business days]</strong> for the refund to reflect in your
              account. This timeframe is dependent on the policies of your bank
              and our payment processor (Razorpay).
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">4. Exceptions</h2>
            <p>
              In the rare event that a hospital or doctor cancels an appointment,
              you will receive a full refund, regardless of the time of cancellation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">5. Contact Us</h2>
            <p>
              If you have any questions about our Cancellation & Refund Policy,
              please contact us at [Your Support Email Address].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
