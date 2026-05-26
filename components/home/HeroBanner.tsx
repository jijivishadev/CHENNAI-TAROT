"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/shared/Button";

type ViewportMode = "mobile" | "tablet" | "desktop";

function getViewportMode(width: number): ViewportMode {
  if (width <= 767) return "mobile";
  if (width <= 1023) return "tablet";
  return "desktop";
}

const LOCAL_HERO = {
  mobile: {
    image: "/abput_mobile-banner.jpg",
    headline: "Clear Blocks.\nCreate Millions.",
    subheadline:
      "Align within. Expand your wealth. Step into multi-million dollar success.",

    headlineSize: 26,
    subheadlineSize: 14,

    x: 50,
    y: 35,
    align: "center" as const,
    maxWidth: "92%",
    overlay: "rgba(0,0,0,0.55)",
  },

  tablet: {
    image: "/abput_mobile-banner.jpg",
    headline: "Clear Blocks. Create Millions.",
    subheadline:
      "Align within. Expand your wealth. Step into multi-million dollar success.",

    headlineSize: 38,
    subheadlineSize: 17,

    x: 8,
    y: 24,
    align: "left" as const,
    maxWidth: "75%",
    overlay: "rgba(0,0,0,0.45)",
  },

  desktop: {
    image: "/desktop-hero-banner.jpeg",
    headline: "Clear Blocks. Create Millions.",
    subheadline:
      "Align within. Expand your wealth. Step into multi-million dollar success.",

    headlineSize: 52,
    subheadlineSize: 30,

    x: 3,
    y: 30,
    align: "left" as const,
    maxWidth: "55%",
    overlay: "rgba(0,0,0,0.35)",
  },
};

export default function HeroBanner() {
  const [viewport, setViewport] = useState<ViewportMode | null>(null);

  useEffect(() => {
    const update = () =>
      setViewport(getViewportMode(window.innerWidth));

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ✅ FIX: show fallback instead of null */
  if (!viewport) {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#1A0B2E]"
        style={{
          height: "calc(100vh - 120px)",
          minHeight: "520px",
        }}
      >
        <Image
          src="/desktop-hero-banner.jpeg"
          alt="Hero banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </section>
    );
  }

  const data = LOCAL_HERO[viewport];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "calc(100vh - 120px)",
        minHeight: "520px",
      }}
    >
      {/* IMAGE */}
      <Image
        src={data.image}
        alt="Hero banner"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        style={{ background: data.overlay }}
      />

      {/* CONTENT */}
      <div
        className="absolute"
        style={{
          left: `${data.x}%`,
          top: `${data.y}%`,
          width: data.maxWidth,
          textAlign: data.align,
          transform:
            data.align === "center"
              ? "translateX(-50%)"
              : "translateX(0)",
        }}
      >
        {/* HEADLINE */}
        <h1
          className="font-semibold leading-tight whitespace-pre-line text-[#D4AF37]"
          style={{ fontSize: `${data.headlineSize}px` }}
        >
          {data.headline}
        </h1>

        {/* SUBTEXT */}
        <p
          className="mt-3 leading-relaxed text-white max-w-[600px]"
          style={{ fontSize: `${data.subheadlineSize}px` }}
        >
          {data.subheadline}
        </p>

        {/* BUTTON */}
        <div
          className={`mt-6 ${
            viewport === "mobile" ? "flex justify-center" : ""
          }`}
        >
          <div className="active:scale-95 transition-all duration-150">
            <Link
              href="https://cal.id/jothi-ramesh/discovery-call"
              target="_blank"
            >
              <Button compact={viewport === "mobile"}>
                BOOK DISCOVERY CALL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}