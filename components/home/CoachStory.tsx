"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { aboutContent } from "@/src/content/about";
import { getAboutPageContent } from "@/lib/firebaseServices";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

function normalizeOriginDescription(value?: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || aboutContent.originDescription;
}

function isRemoteImageUrl(value?: string): value is string {
  if (!value || typeof value !== "string") return false;
  return /^https?:\/\//i.test(value.trim());
}

type CoachStoryProps = {
  originImageUrl1?: string;
};

export default function CoachStory({ originImageUrl1 }: CoachStoryProps) {
  const [originCopy, setOriginCopy] = useState<{
    name: string;
    headline: string;
    originDescription: string;
    expertise: string[];
  } | null>(null);
  const [isOriginLoading, setIsOriginLoading] = useState(true);

  useEffect(() => {
    const fetchOriginContent = async () => {
      try {
        const aboutBasic = await getAboutPageContent({
          title: "",
          subtitle: "",
          description: "",
          imageUrl: "",
          expertise: [],
          originDescription: "Loading story...",

        });

        setOriginCopy({
          name: aboutBasic.title?.trim() || "",
          headline: aboutBasic.subtitle?.trim() || "",
          originDescription: normalizeOriginDescription(aboutBasic.originDescription),
          expertise: Array.isArray(aboutBasic.expertise)
            ? aboutBasic.expertise.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
            : [],
        });
      } finally {
        setIsOriginLoading(false);
      }
    };

    fetchOriginContent().catch(() => {
      setOriginCopy(null);
      setIsOriginLoading(false);
    });
  }, []);

  const originImage1Url = isRemoteImageUrl(originImageUrl1) ? originImageUrl1.trim() : undefined;

  const teaser = originCopy?.originDescription || aboutContent.originDescription;

  return (
    <section className="relative w-full overflow-hidden bg-[#F3ECFF] py-32 font-sans">
      {/* diagonal tint: left stays pure lavender, right gets a subtle Deep Purple wash */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(61.5deg,_transparent_0%,_transparent_48%,_rgba(75,46,131,0.09)_48%,_rgba(75,46,131,0.09)_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className={`${playfair.className} text-4xl font-extrabold leading-tight text-[#4B2E83] sm:text-6xl`}>
              {aboutContent.bioTeaserHeading}
            </h2>
            {isOriginLoading ? (
              <>
                <div className="mt-4 h-10 w-56 animate-pulse rounded bg-[#D4AF37]/35" />
                <div className="mt-4 h-4 w-[82%] animate-pulse rounded bg-[#4B2E83]/18" />
                <div className="mt-2 h-4 w-[70%] animate-pulse rounded bg-[#4B2E83]/18" />

                <div className="mt-6 max-w-xl space-y-3">
                  <div className="h-4 w-[94%] animate-pulse rounded bg-[#333333]/18" />
                  <div className="h-4 w-[88%] animate-pulse rounded bg-[#333333]/18" />
                  <div className="h-4 w-[84%] animate-pulse rounded bg-[#333333]/18" />
                  <div className="h-4 w-[76%] animate-pulse rounded bg-[#333333]/18" />
                </div>

                <aside className="mt-6 rounded-2xl border border-[#4B2E83]/15 bg-white p-5 shadow-sm">
                  <div className="h-4 w-36 animate-pulse rounded bg-[#4B2E83]/20" />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <span
                        key={`expertise-skeleton-${idx}`}
                        className="inline-flex h-7 w-24 animate-pulse rounded-full bg-[#F3ECFF]"
                      />
                    ))}
                  </div>
                </aside>

                <div className="mt-8 h-14 w-44 animate-pulse rounded-full bg-[#D4AF37]/70" />
              </>
            ) : (
              <>
                <p className={`${playfair.className} mt-3 text-3xl font-semibold text-[#D4AF37] sm:text-4xl`}>
                  {originCopy?.name}
                </p>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-[#4B2E83] sm:text-base">
                  {originCopy?.headline}
                </p>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#333333] sm:text-[1.05rem] sm:leading-8">
                  {teaser}
                </p>

                <aside className="mt-6 rounded-2xl border border-[#4B2E83]/15 bg-white p-6 shadow-sm">
                  <p className="text-base font-semibold text-[#4B2E83] sm:text-lg">{aboutContent.areasOfExpertiseLabel}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {originCopy?.expertise.map((item) => (
                      <span
                        key={item}
                        className="inline-flex rounded-full bg-[#F3ECFF] px-4 py-1.5 text-sm font-semibold text-[#4B2E83]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </aside>

                <div className="mt-8">
                  <Link
                    href={aboutContent.bioTeaserCtaLink}
                    className="group inline-flex items-center gap-3 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-7 py-3 font-bold uppercase tracking-wide text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                    aria-label={aboutContent.bioTeaserCtaLabel}
                  >
                    <span className="font-semibold text-base">{aboutContent.bioTeaserCtaLabel}</span>
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
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-[600px] aspect-[3/4] sm:ml-auto sm:translate-x-4">
              {isOriginLoading ? (
                <div className="h-full w-full animate-pulse rounded-2xl bg-[#4B2E83]/10 shadow-2xl" />
              ) : originImage1Url ? (
                <div className="relative h-full w-full rounded-2xl bg-[#F3ECFF] shadow-2xl">
                  <Image
                    src={originImage1Url}
                    alt={`Portrait of ${originCopy?.name || "the coach"}`}
                    fill
                    className="rounded-2xl object-contain"
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 44vw, 92vw"
                    priority
                  />
                </div>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(160deg,_#2F1A52_0%,_#4B2E83_52%,_#6E52A3_100%)] shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,_rgba(243,236,255,0.3)_0%,_transparent_36%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_82%,_rgba(243,236,255,0.2)_0%,_transparent_30%)]" />
                  <div className="relative h-20 w-20 animate-pulse rounded-full border border-[#F3ECFF]/30 bg-[#F3ECFF]/10 backdrop-blur-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
