import React from 'react';
import { Heart } from 'lucide-react'; 

/**
 * Privacy Policy Page
 * * IMPORTANT: This is a GENERIC TEMPLATE. It is NOT legal advice.
 * You MUST have this policy reviewed and customized by a legal professional
 * to ensure it complies with all applicable laws (e.g., HIPAA, GDPR, CCPA)
 * especially given you are a HEALTHCARE platform.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">
        
        <div className="flex items-center gap-3 mb-6">
           <Heart className="h-6 w-6 text-primary" />
           <h1 className="text-3xl font-extrabold text-foreground">
             Privacy Policy
           </h1>
        </div>
        
        <p className="mb-4 text-sm text-destructive font-semibold bg-destructive/10 p-3 rounded-lg">
          <strong>Disclaimer:</strong> This is a template and not legal advice. 
          Please consult with a legal professional to ensure your Privacy Policy 
          is compliant with all relevant healthcare and data protection laws.
        </p>

        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            Welcome to HealthCare+ ("us", "we", "or "our"). We are committed to protecting your
            personal information and your right to privacy. If you have any questions or
            concerns about this privacy notice, or our practices with regards to your
            personal information, please contact us.
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you
              register on the platform, book an appointment, or otherwise contact us.
            </p>
            <p>
              The personal information that we collect depends on the context of your
              interactions with us and the platform, but may include the following:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Personal Identification Info:</strong> Name, email address, phone number, date of birth.</li>
              <li><strong>Health Information:</strong> Information about your appointments, medical history, and symptoms as provided by you. (NOTE: This is Protected Health Information (PHI) and requires strict compliance).</li>
              <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number. All payment data is stored by our payment processor (e.g., Razorpay) and you should review their privacy policies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>
              We use personal information collected via our platform for a variety of
              business purposes described below:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>To facilitate account creation and logon process.</li>
              <li>To schedule and manage your appointments with healthcare providers.</li>
              <li>To process your payments and prevent transactional fraud.</li>
              <li>To send administrative information to you (e.g., confirmations, updates).</li>
              <li>To respond to your inquiries and solve any potential issues.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">3. Will Your Information Be Shared?</h2>
            <p>
              We only share information with your consent, to comply with laws, to
              provide you with services, to protect your rights, or to fulfill
_            business obligations.
            </p>
            <p>
              Specifically, we may need to share your data with the hospital and doctor
              you are booking an appointment with to facilitate the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security
              measures designed to protect the security of any personal information we
              process. However, despite our safeguards, no electronic transmission
              over the Internet can be guaranteed to be 100% secure.
            </p>
          </section>

           <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">5. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">6. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may
              contact us at [Your Support Email Address].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

