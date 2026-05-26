"use client";

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { useEffect, useRef, useState } from "react";

import { getPathwaysContent } from "@/lib/firebaseServices";
import { PathwayCard, PathwaysContent } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function ProgramGrid() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [showBackOnce, setShowBackOnce] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoadingPathways, setIsLoadingPathways] = useState(true);
  const [pathwaysContent, setPathwaysContent] = useState<PathwaysContent | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const loadPathways = async () => {
      setIsLoadingPathways(true);
      try {
        const data = await getPathwaysContent();
        setPathwaysContent(data);
      } catch {
        setPathwaysContent(null);
      } finally {
        setIsLoadingPathways(false);
      }
    };

    loadPathways();
  }, []);

  useEffect(() => {
    if (hasEntered) return;

    const target = sectionRef.current;
    if (!target) return;

    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const revealTimer = window.setTimeout(() => {
      setShowBackOnce(true);
    }, 650);

    const hideTimer = window.setTimeout(() => {
      setShowBackOnce(false);
    }, 1900);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
    };
  }, [hasEntered]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cards: PathwayCard[] = pathwaysContent?.cards ?? [];

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#E8E0FF] pb-24 pt-20 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(60deg,_rgba(75,46,131,0.08)_0%,_rgba(75,46,131,0.08)_48%,_transparent_48%,_transparent_100%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <header className="mx-auto max-w-3xl text-center">
          {isLoadingPathways ? (
            <>
              <div className="mx-auto h-4 w-48 animate-pulse rounded bg-[#D4AF37]/45" />
              <div className="mx-auto mt-4 h-12 w-80 animate-pulse rounded bg-[#4B2E83]/20" />
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37] sm:text-sm">
                {pathwaysContent?.eyebrow}
              </p>
              <h2 className={`${playfair.className} mt-4 text-4xl text-[#4B2E83] sm:text-5xl`}>
                {pathwaysContent?.heading}
              </h2>
            </>
          )}
        </header>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {isLoadingPathways
            ? Array.from({ length: 3 }).map((_, idx) => (
                <article
                  key={`pathways-skeleton-${idx}`}
                  className="h-[17.5rem] w-full rounded-2xl bg-white p-7 shadow-sm"
                >
                  <div className="mb-5 h-9 w-9 animate-pulse rounded-lg bg-[#D4AF37]/45" />
                  <div className="h-10 w-4/5 animate-pulse rounded bg-[#4B2E83]/20" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-[92%] animate-pulse rounded bg-[#333333]/15" />
                    <div className="h-4 w-[84%] animate-pulse rounded bg-[#333333]/15" />
                    <div className="h-4 w-[70%] animate-pulse rounded bg-[#333333]/15" />
                  </div>
                </article>
              ))
            : cards.map((card) => {
            const shouldAutoFlip = showBackOnce;
            const shouldFlip = Boolean(flippedCards[card.id]) || shouldAutoFlip;

            return (
            <article
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="group h-[17.5rem] w-full cursor-pointer [perspective:1200px]"
            >
              <div
                className={`relative h-full w-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${shouldFlip ? "[transform:rotateY(180deg)]" : "md:group-hover:[transform:rotateY(180deg)]"}`}
              >
                <div className="absolute inset-0 flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm [backface-visibility:hidden]">
                  <div className="mb-5 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#D4AF37]">
                    <Image
                      src="/milliondollarscoach_logo.jpeg"
                      alt="Million Dollars Coach emblem"
                      width={36}
                      height={36}
                      className="h-7 w-7 rounded-md object-cover"
                    />
                  </div>

                  <h3 className={`${playfair.className} text-2xl text-[#4B2E83]`}>{card.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-[#333333]/88">{card.mainContent}</p>
                </div>

                <div className="absolute inset-0 flex h-full flex-col rounded-2xl bg-[#4B2E83] p-7 text-[#F3ECFF] shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h3 className={`${playfair.className} text-2xl text-[#D4AF37]`}>What you get</h3>
                  <ul className="mt-5 space-y-3 text-sm leading-7">
                    {card.flipContent.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
