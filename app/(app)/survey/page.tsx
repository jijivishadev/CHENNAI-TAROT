"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { surveyContent } from "@/src/content/survey";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

interface SurveySettings {
  embedCode: string;
  updatedAt?: number;
}

export default function SurveyPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - Survey";
  }, []);

  const [embedCode, setEmbedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveySettings = async () => {
      try {
        const docRef = doc(db, "settings", "survey");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SurveySettings;
          setEmbedCode(data.embedCode || null);
        } else {
          setEmbedCode(null);
        }
      } catch (error) {
        console.error("Error fetching survey settings:", error);
        setEmbedCode(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveySettings();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3ECFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </main>
    );
  }

  // If no embed code is set, show a message
  if (!embedCode) {
    return (
      <main className="min-h-screen bg-[#F3ECFF] pb-20 font-sans">
        <section className="mx-auto w-full max-w-4xl px-6 pt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4B2E83]">{surveyContent.pageLabel}</p>
          <h1 className={`${playfair.className} mt-2 text-3xl text-[#4B2E83] sm:text-4xl`}>{surveyContent.heroTitle}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-[#333333]/70">{surveyContent.heroDescription}</p>
          <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]/50" />
          <div className="mt-10 rounded-xl border border-[#D4AF37]/20 bg-white/80 p-8 text-center">
            <p className="text-[#333333]/60">Survey form will appear here once configured in the admin panel.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3ECFF] pb-20 font-sans">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4B2E83]">{surveyContent.pageLabel}</p>
        <h1 className={`${playfair.className} mt-2 text-3xl text-[#4B2E83] sm:text-4xl`}>{surveyContent.heroTitle}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-[#333333]/70">{surveyContent.heroDescription}</p>
        <div className="mx-auto mt-4 h-px w-16 bg-[#D4AF37]/50" />
      </section>

      {/* Survey Embed - Only from Firebase */}
      <section className="mx-auto w-full max-w-4xl px-6 mt-6">
        <div className="rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-white shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: embedCode }} />
        </div>
      </section>
    </main>
  );
}