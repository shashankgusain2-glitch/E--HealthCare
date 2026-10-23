import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react'; // Using icons

/**
 * Contact Us Page
 * * Provides users with ways to contact your service.
 * You MUST replace the placeholder text with your actual contact details.
 */
export default function ContactUsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">
        
        <div className="flex items-center gap-3 mb-6">
           <Heart className="h-6 w-6 text-primary" />
           <h1 className="text-3xl font-extrabold text-foreground">
             Contact Us
           </h1>
        </div>
        
        <div className="space-y-8 text-muted-foreground">
          <p className="text-lg">
            We're here to help! If you have any questions about our service, 
            need assistance with your account, or have any concerns, 
            please don't hesitate to get in touch with us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Support */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Email Support</h3>
                <p>
                  For general inquiries, billing questions, and support, 
                  please email us.
                </p>
                <a 
                  href="mailto:[Your-Support-Email@example.com]" 
                  className="text-primary font-medium hover:underline"
                >
                  [Your-Support-Email@example.com]
                </a>
              </div>
            </div>

            {/* Phone Support */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Phone Support</h3>
                <p>
                  You can reach our support team by phone during business hours.
                </p>
                <a 
                  href="tel:[+1-234-567-890]" 
                  className="text-primary font-medium hover:underline"
                >
                  [+1 234 567 890]
                </a>
                <p className="text-sm mt-1">(Mon-Fri, 9:00 AM - 6:00 PM)</p>
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Our Office</h3>
              <p>
                While we are primarily a digital platform, you can reach us 
                by mail at our physical address.
              </p>
              <address className="not-italic mt-2">
                [7217089754 HealthCare Plaza]
                <br />
                [City, State, Zip Code]
                <br />
                [Country]
              </address>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
