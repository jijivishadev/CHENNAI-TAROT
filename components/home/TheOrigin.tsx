"use client";
import React, { useEffect, useState } from "react";
import { useAboutPageContent } from "@/hooks/useAboutPageContent";
import { getSiteAssets } from "@/lib/firebaseServices";
import Image from "next/image";

const ORIGIN_TEXT = `What if your biggest business problem was never a strategy problem? After many years as a Software Engineer in the US and South Korea, I discovered that the most powerful breakthroughs happen not in boardrooms — but within. Inspired by a life-changing pilgrimage to Mount Kailash, I left tech to pursue a singular mission — to empower 25 million lives. As an Intuitive Business and Money Coach, I blend analytical rigor with psychic clarity, drawing on NLP, Ontology, Law of Attraction, Access Consciousness, and Psychic Intuition to help entrepreneurs identify what is truly holding them back — and move past it for good. My clients don't just grow their business. They transform their relationship with money, success, and themselves. With over 22 years of combined experience — from engineering boardrooms in the US and South Korea to transformational coaching rooms across the world — I bring a rare depth that no single discipline alone could ever offer.`;

export default function TheOrigin() {
  const { content, loading } = useAboutPageContent({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    expertise: [],
    originDescription: "Loading fresh data...", 
  });

  const expertise: string[] = Array.isArray(content.expertise) ? content.expertise : [];

  const [images, setImages] = useState({ url1: "/Origin.jpg.jpeg" });

  useEffect(() => {
    getSiteAssets().then(assets => {
      if (assets.originImageUrl1) setImages({ url1: assets.originImageUrl1 });
    });
  }, []);

  if (loading) return <div className="py-20 text-center">Fetching fresh story...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
      <div className="relative aspect-square w-full max-w-xl mx-auto">
        <Image
          src={images.url1}
          alt="The Origin"
          fill
          className="rounded-2xl object-cover shadow-2xl"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-sm">The Origin</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A0B2E]">
            {content.title || "Jothi Ramesh"}
          </h2>
        </div>
        
        <div className="text-lg text-[#1A0B2E]/80 leading-relaxed whitespace-pre-wrap">
          {ORIGIN_TEXT}
        </div>

        <div className="pt-4">
          <div className="text-sm font-bold text-[#1A0B2E] mb-4 uppercase tracking-widest">Areas of Expertise</div>
          <div className="flex flex-wrap gap-2">
            {expertise.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-[#F3ECFF] text-[#4B2E83] rounded-full text-xs font-bold shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}