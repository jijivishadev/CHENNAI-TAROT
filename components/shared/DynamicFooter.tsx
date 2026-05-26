"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { Facebook, Instagram, Link as LinkIcon, Linkedin, Mail, Phone, Youtube } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { globalContent } from "@/src/content/global";
import { getFooterContactInfo } from "@/lib/firebaseServices";
import type { ContactInfo, SocialPlatform } from "@/types";
import { db } from "@/lib/firebase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14.5 3.5a1 1 0 0 0-1 1 1 1 0 0 0 .28.69l-2.08.39a10.2 10.2 0 0 0-4.24 1.87 2 2 0 0 0-1.52-.7 2.03 2.03 0 0 0-2.02 2.03c0 .64.3 1.22.77 1.6-.14.39-.21.81-.21 1.24 0 2.83 3.44 5.12 7.68 5.12s7.68-2.29 7.68-5.12c0-.43-.08-.85-.21-1.24.47-.38.77-.96.77-1.6a2.03 2.03 0 0 0-2.02-2.03c-.68 0-1.29.34-1.65.85a8.73 8.73 0 0 0-2.92-1.13l.34-1.62c.55-.05.99-.5.99-1.06a1.06 1.06 0 1 0-1.06 1.06zm-5.9 8.22a.88.88 0 1 1 1.76 0 .88.88 0 0 1-1.76 0zm6.74 0a.88.88 0 1 1 1.76 0 .88.88 0 0 1-1.76 0zm-5.83 2.19a.36.36 0 0 1 .5-.05c.56.42 1.22.63 1.98.63.76 0 1.42-.21 1.98-.63a.36.36 0 1 1 .44.57c-.7.53-1.54.8-2.42.8-.88 0-1.72-.27-2.42-.8a.36.36 0 0 1-.06-.52z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 3H22l-6.78 7.74L23.2 21h-6.6l-5.17-6.5L5.73 21H2.6l7.35-8.4L1 3h6.76l4.7 5.92L18.9 3Zm-1.16 16h1.72L6.82 4.98H5.08L17.74 19Z" />
    </svg>
  );
}

export default function DynamicFooter() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);

  useEffect(() => {
    getFooterContactInfo()
      .then((contact) => {
        setContactInfo(contact);
      })
      .catch((error) => {
        console.error("Error fetching footer contact info:", error);
      });

    const socialsQuery = query(collection(db, "social_platforms"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      socialsQuery,
      (snapshot) => {
        const socials = snapshot.docs.map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...(snapshotDoc.data() as Omit<SocialPlatform, "id">),
        }));
        setSocialPlatforms(socials);
      },
      (error) => {
        console.error("Error syncing footer social platforms:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getSocialIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("instagram")) return Instagram;
    if (lowerName.includes("youtube")) return Youtube;
    if (lowerName.includes("facebook")) return Facebook;
    if (lowerName.includes("linkedin")) return Linkedin;
    if (lowerName.includes("reddit")) return RedditIcon;
    if (lowerName.includes("twitter") || lowerName === "x" || lowerName.includes("x.com")) return XIcon;
    return LinkIcon;
  };

  // Clean phone number for tel: link (remove spaces, dashes, brackets)
  const getCleanPhoneNumber = (phone: string) => {
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  const phoneNumber = contactInfo?.mobile || globalContent.footerPhone;
  const emailAddress = contactInfo?.email || globalContent.footerEmail;
  const cleanPhone = getCleanPhoneNumber(phoneNumber);

  return (
    <footer id="site-footer" className="relative w-full overflow-hidden bg-[#1A0B2E] font-sans text-[#F3ECFF]">
      {/* High-End Ghost Watermark */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B2E83] to-[#1A0B2E] opacity-90" />
        <Image
          src={globalContent.footer.backgroundImageUrl}
          alt={globalContent.footer.backgroundImageAlt}
          fill
          className="scale-150 rotate-12 object-cover opacity-5 mix-blend-overlay grayscale"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        
        {/* Mobile View: High-End Glass Architecture */}
        <div className="md:hidden">
          <div className="rounded-3xl border border-[#D4AF37]/20 bg-white/5 p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col items-center space-y-6 text-center">
              <Image
                src={globalContent.logoUrl}
                alt={globalContent.brandName}
                width={180}
                height={50}
                className="h-12 w-auto object-contain brightness-110"
              />
              <h3 className={`${playfair.className} text-3xl leading-tight text-[#F3ECFF]`}>
                {globalContent.footer.headline}
              </h3>
              <p className="text-sm leading-relaxed text-[#F3ECFF]/70">
                {globalContent.footer.description}
              </p>

              {/* Social Pills */}
              <div className="flex flex-wrap gap-4 pt-2">
                {socialPlatforms.map((platform) => {
                  const Icon = getSocialIcon(platform.name);
                  return (
                    <a
                      key={platform.id}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#F3ECFF]/5 text-[#F3ECFF] shadow-[0_0_0_1px_rgba(212,175,55,0.06)] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                      aria-label={platform.name}
                    >
                      <Icon className={`${platform.name.toLowerCase().includes("reddit") ? "h-5 w-5" : "h-4 w-4"} shrink-0 transition-transform group-hover:scale-110`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Symmetrical 2-Column Links Grid for Mobile */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                {globalContent.footer.exploreLabel}
              </h4>
              <ul className="space-y-3">
                {globalContent.footer.exploreLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#F3ECFF]/80 transition-colors hover:text-[#D4AF37]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                {globalContent.footer.contactLabel}
              </h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href={`tel:${cleanPhone}`}
                    className="block text-xs text-[#F3ECFF]/80 hover:text-[#D4AF37] transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${emailAddress}`}
                    className="block break-all text-xs text-[#F3ECFF]/80 hover:text-[#D4AF37] transition-colors"
                  >
                    {emailAddress}
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#F3ECFF]/80 transition-colors hover:text-[#D4AF37]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop View: Architectural Pillar Grid */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Brand Story Pillar */}
          <div className="col-span-5 space-y-6 pr-8">
            <Image
              src={globalContent.logoUrl}
              alt={globalContent.brandName}
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
            />
            <h3 className={`${playfair.className} text-4xl leading-snug text-[#F3ECFF]`}>
              {globalContent.footer.headline}
            </h3>
            <p className="text-sm leading-7 text-[#F3ECFF]/60">
              {globalContent.footer.description}
            </p>
          </div>

          {/* Nav Pillars with Vertical Accents */}
          <div className="col-span-2 border-l border-[#D4AF37]/10 pl-8">
            <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              {globalContent.footer.exploreLabel}
            </h4>
            <ul className="space-y-4">
              {globalContent.footer.exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-light text-[#F3ECFF]/70 transition-all hover:tracking-widest hover:text-[#D4AF37]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-3 border-l border-[#D4AF37]/10 pl-8">
            <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              Connect
            </h4>
            <div className="space-y-6">
              <div className="space-y-3 text-sm text-[#F3ECFF]/70">
                <a 
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-3 transition-colors hover:text-[#D4AF37]"
                >
                  <Phone className="h-4 w-4 text-[#D4AF37]" /> 
                  {phoneNumber}
                </a>
                <a 
                  href={`mailto:${emailAddress}`}
                  className="flex items-center gap-3 break-all transition-colors hover:text-[#D4AF37]"
                >
                  <Mail className="h-4 w-4 text-[#D4AF37]" /> 
                  {emailAddress}
                </a>
              </div>
              <div className="flex flex-wrap gap-4">
                {socialPlatforms.map((platform) => {
                  const Icon = getSocialIcon(platform.name);
                  return (
                    <a
                      key={platform.id}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#F3ECFF]/5 text-[#F3ECFF] shadow-[0_0_0_1px_rgba(212,175,55,0.06)] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                      aria-label={platform.name}
                    >
                      <Icon className={`${platform.name.toLowerCase().includes("reddit") ? "h-5 w-5" : "h-4 w-4"} shrink-0`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-2 border-l border-[#D4AF37]/10 pl-8">
            <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-light text-[#F3ECFF]/70">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-[#D4AF37]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Bar */}
      <div className="relative z-10 border-t border-[#D4AF37]/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-[10px] tracking-[0.1em] text-[#F3ECFF]/40">
            {globalContent.footer.copyright}
          </p>
          <p className="mt-2 text-[10px] tracking-[0.1em] text-[#F3ECFF]/40 md:mt-0">
            Initiated for Instinct, Intellect & Intuition
          </p>
        </div>
      </div>
    </footer>
  );
}