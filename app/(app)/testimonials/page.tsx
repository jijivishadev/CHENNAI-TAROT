"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";

import PortraitReviews from "@/components/testimonials/PortraitReviews";
import { db } from "@/lib/firebase";
import { testimonialsContent } from "@/src/content/testimonials";
import { TestimonialReview, VideoTestimonial } from "@/types";

import dynamic from 'next/dynamic';
const VideoVault = dynamic(() => import('@/components/testimonials/VideoVault'), { ssr: false, loading: () => <div>Loading…</div> });

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

const sectionReveal = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

type VideoCmsDoc = {
  youtubeLink?: string;
  name?: string;
  text?: string;
  createdAt?: number;
};

type ReviewCmsDoc = {
  profilePhoto?: string;
  name?: string;
  designation?: string;
  reviewText?: string;
  createdAt?: number;
};

function toEmbedUrl(url: string) {
  if (!url) {
    return "";
  }

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  const match =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&/]+)/) ||
    url.match(/[?&]v=([^?&/]+)/);

  const videoId = match?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function TestimonialsPage() {
  // FORCE PAGE TITLE
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - Testimonials";
  }, []);

  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);
  const [textReviews, setTextReviews] = useState<TestimonialReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      const [videoSnapshot, reviewSnapshot] = await Promise.all([
        getDocs(query(collection(db, "video_testimonials"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "text_reviews"), orderBy("createdAt", "desc"))),
      ]);

      const videos = videoSnapshot.docs
        .map((snapshotDoc) => ({ id: snapshotDoc.id, ...(snapshotDoc.data() as VideoCmsDoc) }))
        .map((item) => ({
          clientName: item.name?.trim() || "Client",
          youtubeEmbedUrl: toEmbedUrl(item.youtubeLink || ""),
          resultsQuote: item.text?.trim() || "",
          id: item.id,
        }))
        .filter((item) => item.youtubeEmbedUrl);

      const reviews = reviewSnapshot.docs
        .map((snapshotDoc) => ({ id: snapshotDoc.id, ...(snapshotDoc.data() as ReviewCmsDoc) }))
        .map((item) => ({
          reviewerName: item.name?.trim() || "Client",
          designation: item.designation?.trim() || "Community Member",
          portraitUrl: item.profilePhoto?.trim() || "/coach-photo.svg",
          portraitAlt: `Portrait of ${item.name?.trim() || "Client"}`,
          quote: item.reviewText?.trim() || "",
          id: item.id,
        }))
        .filter((item) => item.quote);

      setVideoTestimonials(videos);
      setTextReviews(reviews);
      setIsLoading(false);
    };

    fetchTestimonials().catch(() => {
      setVideoTestimonials([]);
      setTextReviews([]);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F3ECFF] pb-16 sm:pb-20 md:pb-24 pt-24 sm:pt-28 md:pt-32 font-sans">
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-20">
        
        {/* Hero Section - FULLY RESPONSIVE */}
        <motion.div
          className="relative mb-12 md:mb-16 overflow-hidden rounded-2xl md:rounded-[2rem] bg-[#4B2E83] px-5 py-10 sm:px-7 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 text-[#F3ECFF]"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Decorative elements - hidden on mobile */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl hidden md:block" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-3xl hidden md:block" />
          
          <div className="relative z-10 text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white mb-3 sm:mb-4">
              {testimonialsContent.pageLabel}
            </p>
            <h1
              className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white`}
            >
              <span className="text-[#D4AF37]">Aligned Wealth</span>
              <br className="block sm:hidden" />
              <span> in Action</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg leading-relaxed text-white/90 max-w-2xl mx-auto px-4 sm:px-0">
              {testimonialsContent.heroDescription}
            </p>
            <div className="mx-auto mt-6 w-16 h-px bg-[#D4AF37]/50" />
          </div>
        </motion.div>

        {/* Portrait Stories Section */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {isLoading ? (
            <section className="mt-12 w-full">
              <h2 className={`${playfair.className} mb-8 text-center text-2xl text-[#4B2E83] sm:text-3xl md:text-4xl`}>
                Real Stories.Real Inpact
              </h2>
              <div className="space-y-5 md:space-y-7">
                {Array.from({ length: 2 }).map((_, rowIdx) => (
                  <div key={`portrait-skeleton-row-${rowIdx}`} className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
                    {Array.from({ length: 2 }).map((__, colIdx) => (
                      <article
                        key={`portrait-skeleton-${rowIdx}-${colIdx}`}
                        className="relative min-h-[10.75rem] overflow-hidden rounded-2xl border-[0.5px] border-[#D4AF37]/65 bg-white/80 p-4 shadow-[0_8px_20px_rgba(75,46,131,0.12)] backdrop-blur-xl"
                      >
                        <div className="h-4 w-[92%] animate-pulse rounded bg-[#333333]/15" />
                        <div className="mt-2 h-4 w-[72%] animate-pulse rounded bg-[#333333]/15" />
                        <div className="mt-4 h-[1px] w-full bg-[#D4AF37]/35" />
                        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-[#4B2E83]/20" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[#4B2E83]/15" />
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ) : textReviews.length > 0 ? (
            <PortraitReviews reviews={textReviews} />
          ) : (
            <section className="mt-12 rounded-2xl border border-[#D4AF37]/35 bg-white/70 px-6 py-10 text-center text-[#4B2E83]/80">
              No portrait stories available right now.
            </section>
          )}
        </motion.div>

        {/* Video Proof Vault Section */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {isLoading ? (
            <section className="w-full py-16 sm:py-20">
              <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="mb-14 text-center">
                  <div className="mx-auto h-12 w-80 animate-pulse rounded bg-[#4B2E83]/18" />
                  <div className="mx-auto mt-4 h-4 w-[26rem] max-w-full animate-pulse rounded bg-[#333333]/15" />
                </div>
                <div className="grid grid-cols-1 gap-8 sm:gap-10 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <article key={`video-skeleton-${idx}`} className="overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/30 bg-[#4B2E83]">
                      <div className="aspect-video w-full animate-pulse bg-[#D4AF37]/25" />
                      <div className="p-8">
                        <div className="h-3 w-28 animate-pulse rounded bg-[#D4AF37]/40" />
                        <div className="mt-5 h-5 w-[92%] animate-pulse rounded bg-white/20" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : videoTestimonials.length > 0 ? (
            <VideoVault testimonials={videoTestimonials} />
          ) : (
            <section className="mt-10 rounded-2xl border border-[#D4AF37]/35 bg-white/70 px-6 py-10 text-center text-[#4B2E83]/80">
              No video testimonials available right now.
            </section>
          )}
        </motion.div>
      </section>
    </main>
  );
}