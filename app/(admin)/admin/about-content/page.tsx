// app/(admin)/admin/about-content/page.tsx
"use client";

import { useState } from "react";
import BasicInfoTab from "@/components/admin/about/BasicInfoTab";
import EarlyLifeTab from "@/components/admin/about/EarlyLifeTab";
import VideoSectionTab from "@/components/admin/about/VideoSectionTab";
import CoreBeliefsTab from "@/components/admin/about/CoreBeliefsTab";
import MissionTab from "@/components/admin/about/MissionTab";
import RecognitionsTab from "@/components/admin/about/RecognitionsTab";

const TABS = [
  { label: "Basic Info", key: "basic", icon: "📝" },
  { label: "Early Life Cards", key: "earlyLife", icon: "🌱" },
  { label: "Video Section", key: "video", icon: "🎬" },
  { label: "Core Beliefs", key: "beliefs", icon: "💡" },
  { label: "Mission", key: "mission", icon: "🎯" },
  { label: "Recognitions", key: "recognitions", icon: "🏅" },
];

export default function AboutContentPage() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <section className="mx-auto w-full px-6 py-8 md:px-10 min-h-screen bg-[#F8F9FA]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A0B2E] mb-2">About Page Admin</h1>
        
        <div className="flex flex-wrap gap-2 border-b border-[#D4AF37]/30 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-semibold text-[#1A0B2E] border-b-2 transition-all ${
                activeTab === tab.key 
                  ? "border-[#D4AF37] text-[#D4AF37]" 
                  : "border-transparent text-[#1A0B2E]/60 hover:text-[#1A0B2E]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {activeTab === "basic" && <BasicInfoTab />}
        {activeTab === "earlyLife" && <EarlyLifeTab />}
        {activeTab === "video" && <VideoSectionTab />}
        {activeTab === "beliefs" && <CoreBeliefsTab />}
        {activeTab === "mission" && <MissionTab />}
        {activeTab === "recognitions" && <RecognitionsTab />}
      </div>
    </section>
  );
}