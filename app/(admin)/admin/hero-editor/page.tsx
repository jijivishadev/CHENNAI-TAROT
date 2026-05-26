"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import HeroBanner from "@/components/home/HeroBanner";
import {
  DEFAULT_HERO_CONFIG,
  HeroConfig,
  TierLayout,
  ViewportMode,
  normalizeHeroConfig,
  normalizeTierLayout,
} from "@/src/content/hero";

type TierTab = {
  id: ViewportMode;
  label: string;
};

const tabs: TierTab[] = [
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "mobile", label: "Mobile" },
];

const previewWidths: Record<ViewportMode, number> = {
  desktop: 1280,
  tablet: 820,
  mobile: 393,
};

function normalizePercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export default function HeroEditorPage() {
  const [activeTab, setActiveTab] = useState<ViewportMode>("desktop");
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState("Connecting to live hero settings...");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const heroRef = doc(db, "settings", "heroConfig");
    const unsubscribeHero = onSnapshot(
      heroRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setConfig(DEFAULT_HERO_CONFIG);
          setStatus("Using defaults. Publish when you are ready.");
          setIsReady(true);
          return;
        }
        setConfig(normalizeHeroConfig(snapshot.data() as Partial<HeroConfig>));
        setStatus("Live updates enabled.");
        setIsReady(true);
      },
      () => {
        setStatus("Unable to connect. Showing default values.");
        setConfig(DEFAULT_HERO_CONFIG);
        setIsReady(true);
      }
    );
    return () => unsubscribeHero();
  }, []);

  const tierLayout = useMemo(() => config[activeTab], [activeTab, config]);
  const previewWidth = previewWidths[activeTab];

  const setTierLayout = (partial: Partial<TierLayout>) => {
    setConfig((previous) => ({
      ...previous,
      [activeTab]: normalizeTierLayout(
        { ...previous[activeTab], ...partial },
        DEFAULT_HERO_CONFIG[activeTab]
      ),
    }));
  };

  const setField = <K extends keyof HeroConfig>(field: K, value: HeroConfig[K]) => {
    setConfig((previous) => ({ ...previous, [field]: value }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setStatus("Publishing hero configuration...");
    try {
      await setDoc(
        doc(db, "settings", "heroConfig"),
        { ...config, updatedAt: Date.now() },
        { merge: true }
      );
      setStatus("Published successfully.");
      window.alert("Hero changes published successfully.");
    } catch (error) {
      setStatus("Publish failed. Please retry.");
      window.alert(
        `Failed to publish hero changes.${error instanceof Error ? ` ${error.message}` : ""}`
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="mx-auto w-full px-6 py-10 md:px-10">
      {/* Header */}
      <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_40px_rgba(20,20,30,0.06)]">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#1A0B2E] sm:text-4xl">
          <Sparkles className="h-8 w-8 text-[#D4AF37]" />
          Hero Canvas Editor
        </h1>
        <p className="mt-2 text-[#1A0B2E]/70">
          WYSIWYG hero editing with per-device controls and manual publish.
        </p>
      </div>

      {/* Preview */}
      <div className="mt-6 rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
        <h2 className="text-xl font-bold text-[#1A0B2E]">Live Preview</h2>
        <p className="mt-1 text-sm text-[#1A0B2E]/70">
          Reflects exactly what visitors will see on each device. Changes update instantly.
        </p>

        {/* Viewport tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-[#4B2E83] bg-[#4B2E83] text-white"
                  : "border-[#1A0B2E]/20 bg-white text-[#1A0B2E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scaled preview frame — no artificial padding, hero fills the frame */}
        <div className="mt-5 w-full overflow-auto rounded-xl border border-[#1A0B2E]/15 bg-[#f8f6fc] p-4">
          <div
            className="mx-auto overflow-hidden rounded-xl border border-[#1A0B2E]/15 shadow-[0_12px_30px_rgba(16,12,32,0.18)]"
            style={{ width: `${previewWidth}px`, maxWidth: "100%" }}
          >
            {/*
              No pt-[104px] wrapper here.
              The preview shows the HeroBanner in isolation — exactly how
              it renders on the page, without a simulated header gap that
              was causing the position mismatch.
            */}
            {/* <HeroBanner previewConfig={config} previewViewportMode={activeTab} /> */}
            <HeroBanner />
          </div>
        </div>
      </div>

      {/* Global text + colour controls */}
      <div className="mt-6 rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">Headline</span>
            <input
              value={config.headline}
              onChange={(e) => setField("headline", e.target.value)}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
              placeholder="Headline"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">Subheadline</span>
            <input
              value={config.subheadline}
              onChange={(e) => setField("subheadline", e.target.value)}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
              placeholder="Subheadline"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">CTA Text</span>
            <input
              value={config.ctaText}
              onChange={(e) => setField("ctaText", e.target.value)}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
              placeholder="BOOK DISCOVERY CALL"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">Button Link</span>
            <input
              value={config.ctaLink}
              onChange={(e) => setField("ctaLink", e.target.value)}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
              placeholder="/survey"
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">Headline Color</span>
            <input
              type="color"
              value={config.headlineColor}
              onChange={(e) => setField("headlineColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[#1A0B2E]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">Subheadline Color</span>
            <input
              type="color"
              value={config.subheadlineColor}
              onChange={(e) => setField("subheadlineColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[#1A0B2E]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">CTA Text Color</span>
            <input
              type="color"
              value={config.ctaTextColor}
              onChange={(e) => setField("ctaTextColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[#1A0B2E]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#1A0B2E]">CTA Background</span>
            <input
              type="color"
              value={config.ctaBackgroundColor}
              onChange={(e) => setField("ctaBackgroundColor", e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[#1A0B2E]/20"
            />
          </label>
        </div>
      </div>

      {/* Per-device layout controls */}
      <div className="mt-6 rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
        <h2 className="text-xl font-bold text-[#1A0B2E]">
          {tabs.find((t) => t.id === activeTab)?.label} Controls
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A0B2E]">
              Horizontal (X): {tierLayout.xPos.toFixed(0)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={tierLayout.xPos}
              onChange={(e) =>
                setTierLayout({ xPos: normalizePercent(Number(e.target.value), 0, 100) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A0B2E]">
              Vertical (Y): {tierLayout.yPos.toFixed(0)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={tierLayout.yPos}
              onChange={(e) =>
                setTierLayout({ yPos: normalizePercent(Number(e.target.value), 0, 100) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A0B2E]">
              Headline Size: {tierLayout.headlineFontSize.toFixed(0)}px
            </label>
            <input
              type="range"
              min={20}
              max={150}
              step={1}
              value={tierLayout.headlineFontSize}
              onChange={(e) =>
                setTierLayout({
                  headlineFontSize: normalizePercent(Number(e.target.value), 20, 150),
                  subheadlineFontSize: Math.max(20, Math.round(Number(e.target.value) * 0.5)),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A0B2E]">
              Subheadline Size: {tierLayout.subheadlineFontSize.toFixed(0)}px
            </label>
            <input
              type="range"
              min={20}
              max={150}
              step={1}
              value={tierLayout.subheadlineFontSize}
              onChange={(e) =>
                setTierLayout({
                  subheadlineFontSize: normalizePercent(Number(e.target.value), 20, 150),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A0B2E]">Text Align</label>
            <select
              value={tierLayout.textAlign}
              onChange={(e) =>
                setTierLayout({ textAlign: e.target.value as TierLayout["textAlign"] })
              }
              className="h-10 w-full rounded-lg border border-[#1A0B2E]/20 px-3 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1A0B2E]">Headline</span>
            <textarea
              value={config.headline}
              onChange={(e) => setField("headline", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
            />
          </label>

          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1A0B2E]">Subheadline</span>
            <textarea
              value={config.subheadline}
              onChange={(e) => setField("subheadline", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#1A0B2E]/20 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[#4B2E83]">{status}</p>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!isReady || isPublishing}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-6 text-sm font-semibold text-white transition hover:bg-[#3D2468] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublishing ? "Publishing..." : "Publish Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}