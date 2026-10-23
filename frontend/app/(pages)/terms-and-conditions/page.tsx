import React from 'react';
import { Heart, Shield, AlertTriangle } from 'lucide-react'; // Using icons

/**
 * Terms & Conditions Page
 * * IMPORTANT: This is a GENERIC TEMPLATE. It is NOT legal advice.
 * You MUST customize this policy to reflect your actual business practices
 * and have it reviewed by a legal professional.
 */
export default function TermsAndConditionsPage() {
  const companyName = "HealthCare+"; // Replace with your actual company/platform name
  const supportEmail = "[Your-Support-Email@example.com]"; // Replace with your support email

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">
        
        <div className="flex items-center gap-3 mb-6">
           <Shield className="h-6 w-6 text-primary" />
           <h1 className="text-3xl font-extrabold text-foreground">
             Terms & Conditions
           </h1>
        </div>
        
        <p className="mb-4 text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-lg flex gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>
            <strong>Disclaimer:</strong> This is a template. You must customize this 
            document and have it reviewed by a legal professional before publishing.
          </span>
        </p>

        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            Welcome to {companyName}! These Terms and Conditions ("Terms") govern your
            use of our website, platform, and services (collectively, the "Service").
            By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">1. Service Description</h2>
            <p>
              {companyName} provides a platform to connect patients with hospitals
              and doctors ("Providers") to facilitate the booking of in-person and
              video call appointments, manage payments, and provide related healthcare
              coordination services.
            </p>
            <p className="font-semibold text-destructive/80">
              {companyName} is NOT a healthcare provider. We do not provide medical
              advice. All medical advice and treatment are provided by the independent
              Providers. Any information on our platform is for informational purposes only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">2. User Accounts</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                You must be 18 years or older to create an account.
              </li>
              <li>
                You agree to provide accurate, current, and complete information during
                the registration process.
              </li>
              <li>
                You are responsible for safeguarding your password and for all
                activities that occur under your account. You must notify us
                immediately of any unauthorized use of your account.
              </li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">3. Appointments and Payments</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                By booking an appointment, you agree to pay all fees associated
                with the selected service.
              </li>
              <li>
                Payments are processed through our third-party payment gateway (Razorpay).
                We do not store your full credit card information.
              </li>
              <li>
                All payment and refund policies are governed by our{" "}
                <a href="/cancellation-policy" className="text-primary hover:underline">
                  Cancellation & Refund Policy
                </a>.
              </li>
            </ul>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Violate any local, state, national, or international law.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation.</li>
              <li>
                Engage in any activity that is harmful, fraudulent, deceptive,
                threatening, or abusive.
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or data.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">5. Disclaimers</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
              We make no warranties, express or implied, regarding the operation
              of the Service or the reliability, accuracy, or completeness of
              any information provided by the Providers. We explicitly disclaim
              any warranties of merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {companyName} and its affiliates
              shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use, goodwill,
              or other intangible losses, resulting from (a) your access to or use
              of the Service; (b) any conduct or content of any third party (including
              Providers); (c) any medical advice or treatment you receive from a Provider.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of any changes by posting the new Terms on this page.
              Your continued use of the Service after such changes constitutes
              your acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">
                {supportEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
