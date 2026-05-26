"use client";

import { ArrowUp } from "lucide-react";

import { useScroll } from "@/hooks/useScroll";

export default function BackToTopButton() {
  const showButton = useScroll(500);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={`fixed bottom-24 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full font-bold bg-[#D4AF37] text-[#4B2E83] border-2 border-[#D4AF37] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:border-[#4B2E83] transition-all duration-300 uppercase tracking-wide text-sm shadow-[0_14px_28px_rgba(30,16,57,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B2E83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3ECFF] sm:bottom-8 sm:right-8 ${
        showButton
          ? "translate-y-0 opacity-100 animate-pulse"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}