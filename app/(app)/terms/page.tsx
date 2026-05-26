"use client";

import { useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { globalContent } from "@/src/content/global";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function TermsPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - Terms & Conditions";
  }, []);

  return (
    <main className="min-h-screen bg-[#4B2E83] text-[#F8F6FF]">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
        <h1 className={`${playfair.className} text-4xl text-[#D4AF37] sm:text-5xl`}>
          Terms &amp; Conditions
        </h1>
        <p className="mt-5 text-lg leading-9 text-[#F8F6FF]/90">
          These Terms &amp; Conditions govern your access to and use of services provided by {globalContent.brandName}, including
          coaching sessions, consulting engagements, digital materials, and website content.
        </p>
        <p className="mt-3 text-base text-[#F8F6FF]/70">Effective Date: April 4, 2026</p>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>1. Service Scope</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            Services are educational and strategic in nature and are not a substitute for legal, financial, tax,
            medical, or mental health advice unless explicitly stated in writing.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>2. Payments and Refunds</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-[#F8F6FF]/90">
            <li>All fees are listed in the selected offer or proposal.</li>
            <li>Payment timing, installment plans, and due dates are binding once accepted.</li>
            <li>Refund terms follow the written offer or service agreement for your program.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>3. Client Responsibilities</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-8 text-[#F8F6FF]/90">
            <li>Provide accurate information needed for service delivery.</li>
            <li>Attend sessions on time and communicate scheduling changes promptly.</li>
            <li>Use program materials for personal use unless otherwise authorized.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>4. Intellectual Property</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            All content, frameworks, and materials are the property of {globalContent.brandName} unless otherwise stated. You may
            not copy, distribute, or republish without written consent.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>5. Limitation of Liability</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            To the extent permitted by law, {globalContent.brandName} is not liable for indirect, incidental, or consequential
            damages resulting from use of services or website resources.
          </p>
        </section>

        <section className="mt-10 border-t border-[#D4AF37]/35 pt-8">
          <h2 className={`${playfair.className} text-2xl text-[#D4AF37] sm:text-3xl`}>6. Contact</h2>
          <p className="mt-4 text-lg leading-9 text-[#F8F6FF]/90">
            Questions regarding these Terms &amp; Conditions can be sent to {globalContent.footerEmail}.
          </p>
        </section>
      </div>
    </main>
  );
}