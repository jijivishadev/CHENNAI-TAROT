"use client";

import { useEffect, useMemo, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { Boxes, Save, Edit3 } from "lucide-react";

import { getPathwaysContent, updatePathwaysContent } from "@/lib/firebaseServices";
import { PathwaysContent } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

type EditablePathwayCard = {
  id: string;
  title: string;
  mainContent: string;
  flipContentText: string;
};

export default function PathwaysManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [eyebrow, setEyebrow] = useState("");
  const [heading, setHeading] = useState("");
  const [cards, setCards] = useState<EditablePathwayCard[]>([]);

  useEffect(() => {
    const loadPathways = async () => {
      setLoading(true);
      try {
        const data = await getPathwaysContent();
        setEyebrow(data.eyebrow || "");
        setHeading(data.heading || "");
        setCards(
          (data.cards || []).map((card, idx) => ({
            id: card.id || `pathway-card-${idx + 1}`,
            title: card.title || "",
            mainContent: card.mainContent || "",
            flipContentText: Array.isArray(card.flipContent) ? card.flipContent.join("\n") : "",
          }))
        );
      } catch {
        setStatus("Failed to load Pathways content.");
      } finally {
        setLoading(false);
      }
    };

    loadPathways();
  }, []);

  const canSave = useMemo(() => {
    if (!eyebrow.trim() || !heading.trim() || cards.length === 0) return false;
    return cards.every((card) => card.title.trim() && card.mainContent.trim());
  }, [cards, eyebrow, heading]);

  const updateCardField = (id: string, field: keyof EditablePathwayCard, value: string) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, [field]: value } : card)));
  };

  const handleSave = async () => {
    if (!canSave) {
      setStatus("Please fill Section Eyebrow, Heading, card title, and Main Content.");
      return;
    }

    setSaving(true);
    setStatus("");

    const payload: PathwaysContent = {
      eyebrow: eyebrow.trim(),
      heading: heading.trim(),
      cards: cards.map((card) => ({
        id: card.id,
        title: card.title.trim(),
        mainContent: card.mainContent.trim(),
        flipContent: card.flipContentText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      })),
    };

    try {
      await updatePathwaysContent(payload);
      setStatus("Pathways section updated successfully.");
      setEditingCardId(null);
    } catch {
      setStatus("Failed to save Pathways section. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#F3ECFF] via-[#F8F9FA] to-[#e6e0f7] p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[#4B2E83]">Loading pathways content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F3ECFF] via-[#F8F9FA] to-[#e6e0f7] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className={`${playfair.className} mb-2 flex items-center gap-3 text-4xl text-[#4B2E83] md:text-5xl`}>
          <Boxes className="h-9 w-9 text-[#D4AF37]" />
          Pathways Section
        </h1>
        <p className="mb-10 text-[#333333]">Manage the home page Pathways cards and flip content.</p>

        <section className="rounded-2xl border border-[#D4AF37]/25 bg-white/90 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-[#4B2E83]">Section Header</h2>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Eyebrow</span>
              <input
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                placeholder="The Transformation"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Heading</span>
              <input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                placeholder="Pathways to Abundance"
              />
            </label>
          </div>
        </section>

        <div className="mt-8 grid gap-8">
          {cards.map((card, index) => {
            const isEditing = editingCardId === card.id;

            return (
              <section key={card.id} className="rounded-2xl border border-[#D4AF37]/25 bg-white/90 p-8 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#4B2E83]">Patch Box {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => setEditingCardId(isEditing ? null : card.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#4B2E83] px-4 py-2 text-sm font-semibold text-[#4B2E83] transition hover:bg-[#4B2E83] hover:text-[#D4AF37]"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditing ? "Close Edit" : "Edit"}
                  </button>
                </div>

                {!isEditing ? (
                  <div className="space-y-2 text-[#333333]">
                    <p><span className="font-semibold text-[#4B2E83]">Title:</span> {card.title || "-"}</p>
                    <p><span className="font-semibold text-[#4B2E83]">Main Content:</span> {card.mainContent || "-"}</p>
                    <p><span className="font-semibold text-[#4B2E83]">Flip Content:</span> {(card.flipContentText || "-").split("\n").filter(Boolean).join(" | ")}</p>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Title</span>
                      <input
                        value={card.title}
                        onChange={(e) => updateCardField(card.id, "title", e.target.value)}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Main Content</span>
                      <textarea
                        value={card.mainContent}
                        onChange={(e) => updateCardField(card.id, "mainContent", e.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                        placeholder="This appears on the front side of the card."
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Flip Content</span>
                      <textarea
                        value={card.flipContentText}
                        onChange={(e) => updateCardField(card.id, "flipContentText", e.target.value)}
                        rows={6}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                        placeholder="One line per point for the card back side."
                      />
                    </label>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            disabled={saving || !canSave}
            onClick={handleSave}
            className="inline-flex items-center rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#3D2468] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Pathways"}
          </button>
          {status ? <span className="text-sm text-[#4B2E83]">{status}</span> : null}
        </div>
      </div>
    </div>
  );
}
