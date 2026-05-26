"use client";

import { useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { globalContent } from "@/src/content/global";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function PrivacyPolicyPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - Privacy Policy";
  }, []);

  return (
    <main className="min-h-screen bg-[#4B2E83] text-[#F8F6FF]">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
        <h1 className={`${playfair.className} text-4xl text-[#D4AF37] sm:text-5xl`}>
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg leading-9 text-[#F8F6FF]/90">
          This Privacy Policy describes how {globalContent.brandName} collects, uses, and protects your information when you
          access coaching programs, consulting sessions, digital resources, and related services.
        </p>
        <p className="mt-3 text-base text-[#F8F6FF]/70">Effective Date: April 4, 2026</p>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>1. Information We Collect</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            We may collect personal and usage information when you book sessions, submit forms, subscribe to updates,
            or interact with our website.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-[#F8F6FF]/90">
            <li>Contact details such as your name, email, and phone number.</li>
            <li>Billing details needed to process purchases securely.</li>
            <li>Session intake information you choose to share.</li>
            <li>Technical data such as device type, browser, and analytics events.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>2. How We Use Information</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-[#F8F6FF]/90">
            <li>To deliver coaching and consulting services you request.</li>
            <li>To communicate about scheduling, updates, and support.</li>
            <li>To process transactions and maintain internal records.</li>
            <li>To improve website performance, security, and user experience.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>3. Sharing and Disclosure</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            We do not sell your personal data. Information may be shared only with trusted providers that support
            payments, scheduling, analytics, hosting, or legal compliance obligations.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>4. Data Security</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            We use reasonable administrative, technical, and organizational safeguards to protect your information.
            No online platform can guarantee absolute security.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>5. Your Rights</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            You may request access, correction, or deletion of personal data where legally applicable. To submit a
            request, contact us at {globalContent.footerEmail}.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>6. Contact</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            If you have questions about this Privacy Policy, contact {globalContent.brandName} at {globalContent.footerEmail}.
          </p>
        </section>
      </div>
    </main>
  );
}