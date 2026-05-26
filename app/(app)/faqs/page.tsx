"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

import FaqItem from "@/components/shared/FaqItem";
import { getFaqs, FAQRecord } from "@/lib/firebaseServices";
import { globalContent } from "@/src/content/global";
import { faqsContent } from "@/src/content/faqs";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function FaqsPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - FAQs";
  }, []);

  const [faqs, setFaqs] = useState<FAQRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      setLoading(true);
      try {
        const items = await getFaqs();
        setFaqs(items);
        setOpenId(items[0]?.id ?? null);
        console.log("[FaqsPage] FAQs loaded:", items.length);
      } catch (error) {
        console.error("[FaqsPage] Error loading FAQs:", error);
        const localItems = faqsContent.items.map((item, index) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          order: index,
        })) as FAQRecord[];
        setFaqs(localItems);
        setOpenId(localItems[0]?.id ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const contactEmails = useMemo(() => {
    const emails = [globalContent.email, globalContent.footerEmail];
    return Array.from(new Set(emails));
  }, []);

  const supportPhone = useMemo(() => {
    const phones = [globalContent.phone, globalContent.footerPhone].filter(Boolean);
    return Array.from(new Set(phones))[0] ?? "";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1A0B2E] via-[#4B2E83] to-[#1A0B2E] bg-fixed pb-24 pt-32 font-sans text-[#F3ECFF] sm:pt-36">
      <section className="mx-auto w-full max-w-6xl px-6">
        <header className="text-center">
          <p className="text-lg font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">{faqsContent.pageLabel}</p>
          <h1 className={`${playfair.className} mt-4 text-5xl text-[#F3ECFF]`}>
            {faqsContent.heroTitle}
          </h1>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F3ECFF]/70">
              Direct Support
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base">
              {contactEmails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#F3ECFF]"
                >
                  {email}
                </a>
              ))}
              {supportPhone ? (
                <a
                  href={`tel:${supportPhone.replace(/\s/g, '')}`}
                  className="font-medium text-[#D4AF37] transition-colors duration-300 hover:text-[#F3ECFF]"
                >
                  Call Us: {supportPhone}
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mx-auto mt-14 grid max-w-3xl gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-[#F3ECFF]/70 backdrop-blur-xl"
              >
                <div className="flex justify-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-3 w-3 rounded-full bg-[#D4AF37]"
                  />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="h-3 w-3 rounded-full bg-[#D4AF37]"
                  />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="h-3 w-3 rounded-full bg-[#D4AF37]"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {faqs.map((item) => (
                  <FaqItem
                    key={item.id}
                    id={item.id}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openId === item.id}
                    onToggle={(id) => setOpenId((prev) => (prev === id ? null : id))}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* <section className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.14em] text-[#F3ECFF]/75">Still confused? Let&apos;s chat.</p>
          <Link
            href="/#site-footer"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#4B2E83] transition-colors duration-300 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37]"
          >
            Contact Us
          </Link>
        </section> */}
      </section>
    </main>
  );
}