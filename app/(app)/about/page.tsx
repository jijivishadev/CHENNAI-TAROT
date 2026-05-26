"use client";

import Image from "next/image";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { useAboutPageContent } from "@/hooks/useAboutPageContent";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getEarlyLifeCards, getCoreBeliefs, getMissionSection, getRecognitionsSection, getVideoSection } from "@/lib/firebaseServices";
import type { EarlyLifeCard, CoreBelief, MissionSection, RecognitionsSection, VideoSection } from "@/types";
import Section from "@/components/shared/Section";
import GradientCard from "@/components/shared/GradientCard";
import EmailCaptureModal from "@/components/shared/EmailCaptureModal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { aboutContent } from "@/src/content/about";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], style: ["italic", "normal"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });
const ABOUT_IMAGE_FALLBACK = "/About%20Page.jpg.jpeg";

export default function AboutPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - About";
  }, []);

  const { assets } = useSiteAssets();
  const { content, loading } = useAboutPageContent({
    title: "Jothi Ramesh aka Naran",
    subtitle: "Psychic | Intuitive Life Coach | Tarot Reading",
    description: "22+ years as a Software Engineer turned Intense Spiritual Seeker...",
    imageUrl: ABOUT_IMAGE_FALLBACK,
    expertise: [...aboutContent.expertiseTags],
  });

  // --- States ---
  const [modalOpen, setModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [earlyLifeCards, setEarlyLifeCards] = useState<EarlyLifeCard[]>([]);
  const [earlyLifeLoading, setEarlyLifeLoading] = useState(true);
  const [coreBeliefs, setCoreBeliefs] = useState<CoreBelief[]>([]);
  const [coreBeliefsLoading, setCoreBeliefsLoading] = useState(true);
  const [mission, setMission] = useState<MissionSection | null>(null);
  const [missionLoading, setMissionLoading] = useState(true);
  const [recognitions, setRecognitions] = useState<RecognitionsSection | null>(null);
  const [recognitionsLoading, setRecognitionsLoading] = useState(true);
  const [videoSection, setVideoSection] = useState<VideoSection | null>(null);
  const [videoSectionLoading, setVideoSectionLoading] = useState(true);

  // --- Fetch Video Section ---
  useEffect(() => {
    let isMounted = true;
    setVideoSectionLoading(true);
    getVideoSection()
      .then(data => {
        if (isMounted) setVideoSection(data);
      })
      .catch(() => {
        if (isMounted) setVideoSection(null);
      })
      .finally(() => {
        if (isMounted) setVideoSectionLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // --- Fetch Recognitions Section ---
  useEffect(() => {
    let isMounted = true;
    setRecognitionsLoading(true);
    getRecognitionsSection()
      .then(data => {
        if (isMounted) setRecognitions(data);
      })
      .catch(() => {
        if (isMounted) setRecognitions(null);
      })
      .finally(() => {
        if (isMounted) setRecognitionsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // --- Fetch Mission Section ---
  useEffect(() => {
    let isMounted = true;
    setMissionLoading(true);
    getMissionSection()
      .then(data => {
        if (isMounted) setMission(data);
      })
      .catch(() => {
        if (isMounted) setMission(null);
      })
      .finally(() => {
        if (isMounted) setMissionLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // --- Fetch Core Beliefs ---
  useEffect(() => {
    let isMounted = true;
    setCoreBeliefsLoading(true);
    getCoreBeliefs()
      .then(beliefs => {
        if (isMounted) setCoreBeliefs(beliefs);
      })
      .catch(() => {
        if (isMounted) setCoreBeliefs([]);
      })
      .finally(() => {
        if (isMounted) setCoreBeliefsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // --- Firebase Analytics ---
  useEffect(() => {
    addDoc(collection(db, "analytics"), {
      page: "about",
      visitedAt: serverTimestamp(),
    });
  }, []);

  // --- Fetch Early Life Cards ---
  useEffect(() => {
    let isMounted = true;
    setEarlyLifeLoading(true);
    getEarlyLifeCards()
      .then(cards => {
        if (isMounted) setEarlyLifeCards(cards);
      })
      .catch(() => {
        if (isMounted) setEarlyLifeCards([]);
      })
      .finally(() => {
        if (isMounted) setEarlyLifeLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleWorkWithMe = async () => {
    try {
      await addDoc(collection(db, "leads"), {
        timestamp: serverTimestamp(),
        page: "about",
        action: "work_with_me_click",
      });
      openModal();
    } catch (e) {
      openModal();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDFBFF]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-8"></div>
        <div className="text-[#4B2E83] text-2xl font-semibold tracking-wide text-center">
          Preparing your experience...
        </div>
        <div className="text-[#D4AF37] mt-2 text-base font-medium text-center">
          Please wait while we load the About page.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBFF] text-[#1A0B2E] selection:bg-[#D4AF37] selection:text-white font-sans">
      <style>{`
        html, body { overflow-x: hidden !important; }
        .section-tight { padding-top: 4rem; padding-bottom: 4rem; }
        .drop-cap-tight::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          float: left;
          line-height: 1;
          margin-right: 8px;
          color: #4B2E83;
        }
        .content-text { line-height: 1.6; color: rgba(26, 11, 46, 0.85); }
      `}</style>

      {/* ── HERO SECTION ── */}
      <Section className="relative pt-32 pb-12 px-6 lg:px-20 border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div className="lg:col-span-7 space-y-4" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#4B2E83]" />
              <span className="text-[13px] font-bold tracking-[0.3em] text-[#4B2E83] uppercase">Psychic | Intuitive Business & Money Coach</span>
            </div>
            <h1 className={`${playfair.className} text-5xl lg:text-7xl font-bold leading-tight text-[#D4AF37]`}>
              {content.title}
            </h1>
            <p className={`${cormorant.className} text-xl lg:text-2xl italic font-bold text-[#4B2E83]`}>{content.subtitle}</p>
            <p className="text-base lg:text-lg content-text drop-cap-tight text-justify">
              {content.description}
            </p>

            {content.expertise.length > 0 && (
              <aside className="mt-6 rounded-2xl border border-[#4B2E83]/15 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#4B2E83]">{aboutContent.areasOfExpertiseLabel}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {content.expertise.map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-semibold text-[#4B2E83]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </aside>
            )}
          </motion.div>
          <motion.div className="lg:col-span-5 relative h-[50vh] lg:h-[70vh] rounded-3xl overflow-hidden border border-[#D4AF37]/20 group" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Image
              fill
              priority
              src={assets.aboutSectionImageUrl || content.imageUrl || ABOUT_IMAGE_FALLBACK}
              alt="Portrait"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </Section>

      {/* ── EARLY LIFE & AWAKENING ── */}
      <Section className="section-tight px-2 sm:px-6 lg:px-20 bg-gradient-to-br from-[#F8F6FF] via-[#F3ECFF] to-[#FDFBFF]">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${playfair.className} text-3xl lg:text-5xl font-bold text-[#4B2E83] mb-10`}>Early Life & Spiritual Awakening</h2>
          {earlyLifeLoading ? (
            <div className="text-center py-12 text-[#D4AF37] animate-pulse">Loading...</div>
          ) : earlyLifeCards.length === 0 ? (
            <div className="text-center py-12 text-[#1A0B2E]/50">No early life cards found.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {earlyLifeCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GradientCard className="p-7 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#D4AF37]/10 hover:shadow-xl hover:-translate-y-1 transition-all">
                    {card.imageUrl && (
                      <div className="mb-3 w-full aspect-[3/2] relative rounded-xl overflow-hidden">
                        <Image src={card.imageUrl} alt={card.title} fill className="object-cover" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-[#1A0B2E] border-b border-[#D4AF37]/30 pb-1 mb-3">{card.title}</h3>
                    <p className="text-sm lg:text-base content-text">{card.description}</p>
                  </GradientCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* --- Video Component for About Page --- */}
      <Section className="py-20 px-4 lg:px-20 bg-[#1A0B2E] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          {videoSectionLoading ? (
            <div className="text-center py-12 text-[#D4AF37] animate-pulse">Loading...</div>
          ) : videoSection ? (
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
              {/* Editorial Content Side */}
              <motion.div
                className="lg:w-1/3 text-center lg:text-left w-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
                  {videoSection.title}
                </span>
                <h2 className={`${playfair.className} text-3xl lg:text-5xl text-white mb-6 leading-tight`}>
                  Past <span className="italic text-[#D4AF37]">Few Clients</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto lg:mx-0 mb-6" />
                <p className="text-white/60 text-sm lg:text-base font-light leading-relaxed">
                  {videoSection.description}
                </p>
              </motion.div>

              {/* Video Container */}
              <motion.div
                className="lg:w-2/3 w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="group relative w-full overflow-hidden border border-white/20 shadow-2xl bg-black cursor-pointer block rounded-xl lg:rounded-2xl"
                >
                  <div className="relative w-full aspect-video">
                    {videoSection?.thumbnailUrl ? (
                      <Image
                        src={videoSection.thumbnailUrl}
                        alt={`${videoSection.title} thumbnail`}
                        fill
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="100vw"
                        priority
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4B2E83] to-[#1A0B2E]" />
                    )}

                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#D4AF37] rounded-full animate-ping opacity-40" />
                        <div className="relative w-16 h-16 lg:w-24 lg:h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110">
                          <Play fill="#1A0B2E" size={28} className="ml-1 text-[#1A0B2E] lg:size-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#1A0B2E]/50">No video section data found.</div>
          )}
        </div>
      </Section>

      {/* ── FULLSCREEN VIDEO MODAL ── */}
      <AnimatePresence>
        {isVideoModalOpen && videoSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[95vw] sm:max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-10 right-0 sm:-top-12 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 hover:scale-110 backdrop-blur-sm"
                aria-label="Close video"
              >
                <X size={18} className="sm:size-6" />
              </button>

              <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-2xl">
                <div className="relative w-full flex justify-center">

                  <div className="relative w-full flex justify-center">

                    <div className="
    relative w-full 
    max-w-[420px] 
    sm:max-w-[520px] 
    md:max-w-[700px] 
    lg:max-w-[900px]
    rounded-2xl overflow-hidden bg-black
  ">

                      {/* 🔥 Responsive ratio */}
                      <div className="
      w-full 
      pt-[140%]     /* mobile */
      sm:pt-[110%]  /* tablet */
      md:pt-[75%]   /* small desktop */
      lg:pt-[56.25%] /* full desktop (16:9) */
    " />

                      <iframe
                        src={videoSection.videoUrl + "?autoplay=1&controls=1"}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Client Success Journey"
                        style={{ border: "none" }}
                      />

                    </div>

                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CORE BELIEFS ── */}
      <Section className="section-tight px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${playfair.className} text-3xl lg:text-5xl font-bold text-[#4B2E83] mb-10`}>Core Beliefs</h2>
          {coreBeliefsLoading ? (
            <div className="text-center py-12 text-[#D4AF37] animate-pulse">Loading...</div>
          ) : coreBeliefs.length === 0 ? (
            <div className="text-center py-12 text-[#1A0B2E]/50">No core beliefs found.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {coreBeliefs.map((belief, idx) => (
                <GradientCard key={belief.id} className={`p-8 ${idx % 2 === 1 ? 'bg-[#F3ECFF]/40' : ''}`}>
                  <h2 className={`${playfair.className} text-2xl font-bold text-[#4B2E83] mb-4`}>{belief.title}</h2>
                  <p className="text-sm lg:text-base content-text italic">{belief.description}</p>
                </GradientCard>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ── MISSION & RECOGNITION ── */}
      <Section className="section-tight px-6 lg:px-20 bg-[#F8F6FF]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <motion.div className="space-y-6" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {missionLoading ? (
              <div className="text-center py-12 text-[#D4AF37] animate-pulse">Loading...</div>
            ) : mission ? (
              <>
                <h2 className={`${playfair.className} text-3xl font-bold text-[#1A0B2E]`}>{mission.title}</h2>
                <ul className="space-y-3">
                  {mission.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm lg:text-base group">
                      <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-12 text-[#1A0B2E]/50">No mission data found.</div>
            )}
          </motion.div>
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {recognitionsLoading ? (
              <div className="text-center py-12 text-[#D4AF37] animate-pulse">Loading...</div>
            ) : recognitions ? (
              <>
                <h2 className={`${playfair.className} text-3xl font-bold text-[#1A0B2E]`}>{recognitions.title}</h2>
                <ul className="space-y-3 text-sm lg:text-base content-text">
                  {recognitions.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-12 text-[#1A0B2E]/50">No recognitions data found.</div>
            )}
          </motion.div>
        </div>
      </Section>
    </main>
  );
}