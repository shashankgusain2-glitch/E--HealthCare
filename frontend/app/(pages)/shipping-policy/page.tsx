import React from 'react';
import { Truck, Package } from 'lucide-react';

/**
 * Shipping & Delivery Policy (Razorpay-Compliant)
 * 
 * This page explains both digital service delivery and physical medicine shipment process.
 * It satisfies Razorpay’s requirement for businesses that ship or deliver any physical items.
 */

export default function ShippingPolicyPage() {
  const companyName = "HealthCare+"; // Replace with your company/platform name
  const supportEmail = "support@healthcareplus.com"; // Replace with your support email

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Truck className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-extrabold text-foreground">
            Shipping & Delivery Policy
          </h1>
        </div>

        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          {/* Overview Section */}
          <div className="p-6 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-center mb-4">
              <Package className="h-16 w-16 text-primary/50" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-foreground mb-3">
              Overview
            </h2>
            <p className="text-center text-lg">
              {companyName} provides both healthcare appointment booking services and 
              medicine delivery support through authorized pharmacy partners.
            </p>
            <p className="text-center mt-2">
              Our services include:
            </p>
            <ul className="list-disc list-inside text-center">
              <li>In-person and online (video) healthcare consultations</li>
              <li>Home delivery of prescribed medicines</li>
            </ul>
          </div>

          {/* Digital & In-Person Service Delivery */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Service Delivery</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                <strong>In-Person Appointments:</strong> Services are provided at the
                scheduled time and physical location of your chosen healthcare provider.
              </li>
              <li>
                <strong>Online Consultations:</strong> Services are delivered digitally.
                Upon successful booking and payment, you will receive a confirmation email
                with appointment details and a secure video consultation link.
              </li>
            </ul>
          </section>

          {/* Medicine Shipping Section */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Medicine Shipping</h2>
            <p>
              Medicines prescribed by your healthcare provider can be ordered through our
              partner pharmacies. Once your order is confirmed, it will be shipped to your
              registered address.
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                <strong>Shipping Locations:</strong> We currently deliver across major cities and towns within India.
              </li>
              <li>
                <strong>Delivery Time:</strong> Orders are typically delivered within 
                <strong> 2–7 business days</strong> depending on your location and stock availability.
              </li>
              <li>
                <strong>Shipping Partners:</strong> We work with trusted courier services to ensure safe and timely delivery.
              </li>
              <li>
                <strong>Shipping Charges:</strong> Applicable delivery charges (if any) will be shown at checkout before payment.
              </li>
            </ul>
            <p>
              Once your order is shipped, you will receive an email or SMS notification containing tracking details.
            </p>
          </section>

          {/* Contact Section */}
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
            <p>
              For any questions or concerns regarding service delivery or shipping of medicines,
              please contact our support team at:
            </p>
            <p>
              <a
                href={`mailto:${supportEmail}`}
                className="text-primary hover:underline font-medium"
              >
                {supportEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
