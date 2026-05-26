"use client";

import { useState } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

import { TestimonialReview } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

type PortraitReviewsProps = {
  reviews: TestimonialReview[];
};

function chunkReviews(reviews: TestimonialReview[], size: number) {
  const rows: TestimonialReview[][] = [];

  for (let index = 0; index < reviews.length; index += size) {
    rows.push(reviews.slice(index, index + size));
  }

  return rows;
}

export default function PortraitReviews({ reviews }: PortraitReviewsProps) {
  const INITIAL_VISIBLE = 4;
  const LOAD_STEP = 2;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleReviews = reviews.slice(0, visibleCount);
  const rows = chunkReviews(visibleReviews, 2);
  const hasMore = visibleCount < reviews.length;
  const canShowLess = visibleCount > INITIAL_VISIBLE;

  return (
    <section className="mt-12 w-full">
      <h2 className={`${playfair.className} mb-8 text-center text-2xl text-[#4B2E83] sm:text-3xl md:text-4xl`}>
        Real Stories. Real Impact.
      </h2>

      <div className="space-y-5 md:space-y-7">
        {rows.map((row, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`} className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
              {row.map((review, columnIndex) => {
                const isLeftColumn = columnIndex === 0;
                const avatarOnLeft = isLeftColumn;

                return (
                  <div key={review.id} className="group relative">
                    <div
                      className={`absolute top-1/2 z-10 hidden -translate-y-1/2 md:block ${
                        avatarOnLeft ? "-left-12" : "-right-12"
                      }`}
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#D4AF37]/80 bg-[#1A0B2E] shadow-[0_10px_24px_rgba(26,11,46,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_14px_30px_rgba(26,11,46,0.45)]">
                        <Image src={review.portraitUrl} alt={review.portraitAlt} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E83]/40 via-transparent to-transparent" />
                      </div>
                    </div>

                    <article
                      className={`relative min-h-[10.75rem] overflow-hidden rounded-2xl border-[0.5px] border-[#D4AF37]/65 bg-white/80 p-3 pr-4 pl-4 shadow-[0_8px_20px_rgba(75,46,131,0.12)] backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_rgba(75,46,131,0.16)] sm:min-h-[11rem] sm:p-4 md:p-5 ${
                        avatarOnLeft
                          ? "md:pl-14 md:[clip-path:polygon(9%_0,100%_0,100%_100%,9%_100%,0_72%,0_28%)]"
                          : "md:pr-14 md:[clip-path:polygon(0_0,91%_0,100%_28%,100%_72%,91%_100%,0_100%)]"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_8%_50%,rgba(212,175,55,0.15),transparent_35%),radial-gradient(circle_at_92%_50%,rgba(75,46,131,0.1),transparent_40%)]" />

                      <div className="relative mb-3 flex justify-center md:hidden">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#D4AF37]/70 bg-[#1A0B2E] shadow-[0_8px_20px_rgba(26,11,46,0.28)]">
                          <Image src={review.portraitUrl} alt={review.portraitAlt} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E83]/40 via-transparent to-transparent" />
                        </div>
                      </div>

                      <blockquote className={`${playfair.className} relative text-sm leading-6 text-[#333333] sm:text-[0.95rem] md:text-[0.96rem]`}>
                        &ldquo;{review.quote}&rdquo;
                      </blockquote>

                      <div className="relative mt-2.5 border-t border-[#D4AF37]/40 pt-2.5">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#4B2E83] sm:text-xs">
                          {review.reviewerName}
                        </p>
                        <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-black font-bold sm:text-[0.65rem]">
                          {review.designation}
                        </p>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {(hasMore || canShowLess) && (
        <div className="mt-8 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + LOAD_STEP, reviews.length))}
                className="group inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)]"
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
                onClick={() => setVisibleCount(INITIAL_VISIBLE)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)]"
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
    </section>
  );
}
