"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VideoTestimonial } from "@/types";
import { Playfair_Display } from "next/font/google";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

type VideoCmsDoc = {
  youtubeLink?: string;
  name?: string;
  text?: string;
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

export default function VideoProofGrid() {
  const [dynamicTestimonials, setDynamicTestimonials] = useState<VideoTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicTestimonials = async () => {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(
          query(collection(db, "video_testimonials"), orderBy("createdAt", "desc"))
        );

        const mapped = snapshot.docs
          .map((snapshotDoc) => ({ id: snapshotDoc.id, ...(snapshotDoc.data() as VideoCmsDoc) }))
          .map((item) => ({
            clientName: item.name?.trim() || "Client",
            youtubeEmbedUrl: toEmbedUrl(item.youtubeLink || ""),
            resultsQuote: item.text?.trim() || "",
            id: item.id,
          }))
          .filter((item) => item.youtubeEmbedUrl);

        setDynamicTestimonials(mapped);
      } catch {
        setDynamicTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicTestimonials().catch(() => {
      setDynamicTestimonials([]);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#E8E0FF] py-24 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110.5deg,_rgba(75,46,131,0.08)_0%,_rgba(75,46,131,0.08)_48%,_transparent_48%,_transparent_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">

        {/* Section header */}
        <div className="mb-14 text-center">
          
          <h2 className={`${playfair.className} mt-3 text-4xl text-[#4B2E83] sm:text-5xl`}>
            The Results
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#333333]/75">
            Real stories of aligned abundance in action — from people who chose to do the inner work.
          </p>
        </div>

        {/* Video grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <article
                key={`testimonial-skeleton-${idx}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#4B2E83]/10 bg-[#FAFAFA] shadow-[0_8px_28px_rgba(30,16,57,0.08)]"
              >
                <div className="aspect-video w-full animate-pulse bg-[linear-gradient(135deg,_rgba(75,46,131,0.2),_rgba(212,175,55,0.18),_rgba(75,46,131,0.12))]" />
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="h-12 w-10 animate-pulse rounded bg-[#D4AF37]/35" />
                  <div className="space-y-3">
                    <div className="h-4 w-[92%] animate-pulse rounded bg-[#333333]/15" />
                    <div className="h-4 w-[78%] animate-pulse rounded bg-[#333333]/15" />
                  </div>
                  <div className="mt-auto flex items-center gap-3 border-t border-[#4B2E83]/10 pt-4">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-[#4B2E83]/20" />
                    <div className="h-4 w-28 animate-pulse rounded bg-[#4B2E83]/20" />
                  </div>
                </div>
              </article>
            ))
          ) : dynamicTestimonials.length > 0 ? dynamicTestimonials.slice(0, 3).map((item, idx) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#4B2E83]/10 bg-[#FAFAFA] shadow-[0_8px_28px_rgba(30,16,57,0.08)] transition-shadow duration-300 hover:shadow-[0_18px_48px_rgba(30,16,57,0.14)]"
            >
              {/* Video embed */}
              <div className="relative aspect-video w-full overflow-hidden">
                <iframe
                  src={item.youtubeEmbedUrl}
                  title={`Testimonial from ${item.clientName}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-3 p-6">
                {/* Large decorative quote mark */}
                <span
                  aria-hidden="true"
                  className={`${playfair.className} -mb-2 block text-5xl leading-none text-[#D4AF37]`}
                >
                  &ldquo;
                </span>
                <p className="flex-1 text-sm leading-6 text-[#333333]">
                  {item.resultsQuote}
                </p>
                <div className="mt-2 flex items-center gap-3 border-t border-[#4B2E83]/10 pt-4">
                  {/* Numbered avatar */}
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4B2E83] text-xs font-bold text-[#D4AF37]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#4B2E83]">
                    {item.clientName}
                  </p>
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-full rounded-3xl border border-[#4B2E83]/10 bg-[#FAFAFA] px-6 py-10 text-center text-[#333333]/70">
              No testimonials are available right now.
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-3 rounded-full border border-[#D4AF37] bg-[#D4AF37] py-3 pl-6 pr-3 text-sm font-bold uppercase tracking-[0.13em] text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B2E83] focus-visible:ring-offset-2"
          >
            See All Testimonials
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4B2E83] transition-colors duration-300 group-hover:rotate-[-35deg] group-hover:bg-[#D4AF37]">
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
          </Link>
        </div>

      </div>
    </section>
  );
}
