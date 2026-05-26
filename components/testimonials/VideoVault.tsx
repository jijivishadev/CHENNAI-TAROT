"use client";

import { useState } from "react";
import { VideoTestimonial } from "@/types";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});

type VideoVaultProps = {
  testimonials: VideoTestimonial[];
};

function getYoutubeVideoId(url: string) {
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  const watchMatch = url.match(/[?&]v=([^?&/]+)/);
  if (watchMatch?.[1]) {
    return watchMatch[1];
  }

  const embedMatch = url.match(/embed\/([^?&/]+)/);
  if (embedMatch?.[1]) {
    return embedMatch[1];
  }

  return "";
}

function VideoCard({ testimonial }: { testimonial: VideoTestimonial }) {
  const [isPlayed, setIsPlayed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const videoId = getYoutubeVideoId(testimonial.youtubeEmbedUrl);
  const fallbackThumbnail = "/coach-photo.svg";
  const thumbnailSrc = !imgError && videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : fallbackThumbnail;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/30 bg-black shadow-[0_0_0_1px_rgba(212,175,55,0.08),0_18px_45px_rgba(75,46,131,0.35)]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPlayed ? (
            <motion.div
              key={`thumb-${testimonial.id}`}
              initial={{ opacity: 1 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsPlayed(true)}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <Image
                src={thumbnailSrc}
                alt={testimonial.clientName}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
                placeholder="blur"
                blurDataURL="/placeholder-blur.png"
                loading="lazy"
                onError={() => setImgError(true)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E83]/75 via-[#4B2E83]/15 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-[#D4AF37] backdrop-blur-[3px] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#4B2E83]">
                  <div className="ml-1 h-0 w-0 border-y-[12px] border-y-transparent border-l-[19px] border-l-[#4B2E83] transition-colors duration-300 group-hover:border-l-[#D4AF37]" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.iframe
              key={`player-${testimonial.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-full w-full"
              src={`${testimonial.youtubeEmbedUrl}${
                testimonial.youtubeEmbedUrl.includes("?") ? "&" : "?"
              }autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </AnimatePresence>
      </div>

      <div className="bg-black p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
          {testimonial.clientName}
        </p>
        <blockquote
          className={`${playfair.className} mt-4 text-xl leading-relaxed text-[#F3ECFF]`}
        >
          &ldquo;{testimonial.resultsQuote}&rdquo;
        </blockquote>
      </div>
    </motion.article>
  );
}

export default function VideoVault({ testimonials }: VideoVaultProps) {
  const INITIAL_VISIBLE = 6;
  const LOAD_STEP = 3;

  const [displayCount, setDisplayCount] = useState(INITIAL_VISIBLE);
  const hasMore = displayCount < testimonials.length;
  const canShowLess = displayCount > INITIAL_VISIBLE;

  return (
    <section className="w-full py-16 sm:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-14 text-center">
          <h2
            className={`${playfair.className} text-4xl text-[#4B2E83] md:text-5xl`}
          >
             Watch Breakthroughs Unfold
          </h2>

          <p className="mx-auto mt-4 text-xs tracking-[0.12em] text-[#333333]/85 sm:text-sm md:whitespace-nowrap">
            Across the United States, clients are experiencing profound, life-changing breakthroughs in real time.
          </p>

          <div className="mx-auto mt-6 h-[1px] w-32 bg-[#D4AF37]" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:gap-10 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {testimonials.slice(0, displayCount).map((testimonial) => (
              <VideoCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </AnimatePresence>
        </div>

        {(hasMore || canShowLess) && (
          <div className="mt-16 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    setDisplayCount((count) =>
                      Math.min(count + LOAD_STEP, testimonials.length),
                    )
                  }
                  className="group flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)]"
                >
                  Show More
                  <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4B2E83] transition-colors duration-300 group-hover:rotate-[-35deg] group-hover:bg-[#D4AF37]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-[#D4AF37] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:-rotate-[18deg] group-hover:text-[#4B2E83]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </button>
              )}

              {canShowLess && (
                <button
                  type="button"
                  onClick={() => setDisplayCount(INITIAL_VISIBLE)}
                  className="group flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)]"
                >
                  Show Less
                  <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4B2E83] transition-colors duration-300 group-hover:rotate-[-35deg] group-hover:bg-[#D4AF37]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-[#D4AF37] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:-rotate-[18deg] group-hover:text-[#4B2E83]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}