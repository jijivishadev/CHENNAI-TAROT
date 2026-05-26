import React, { useEffect, useState } from "react";
import { getAboutPageContent, updateAboutPageContent } from "@/lib/firebaseServices";
import { Save, Plus, X } from "lucide-react";

export default function BasicInfoTab() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    expertise: [] as string[],
    originDescription: "",
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fallback = {
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      milestones: [
        { phase: "Phase 1", title: "", description: "" },
        { phase: "Phase 2", title: "", description: "" },
        { phase: "Phase 3", title: "", description: "" },
      ],
      expertise: Array(12).fill("") as string[],
      originDescription: "",
    };
    getAboutPageContent(fallback).then((data) => {
      setForm({
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        expertise: Array.isArray(data.expertise)
          ? data.expertise.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
          : [],
        originDescription: data.originDescription || "",
      });
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateAboutPageContent({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        imageUrl: form.imageUrl,
        expertise: form.expertise,
        originDescription: form.originDescription,
      });
      setMessage("Saved successfully.");
    } catch {
      setMessage("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const addExpertise = () => {
    const value = newExpertise.trim();
    if (!value) return;
    if (form.expertise.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setNewExpertise("");
      return;
    }

    setForm((prev) => ({ ...prev, expertise: [...prev.expertise, value] }));
    setNewExpertise("");
  };

  const removeExpertise = (index: number) => {
    setForm((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 text-[#1A0B2E]/70">Loading...</div>;

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 space-y-6">
      <h2 className="text-xl font-bold text-[#1A0B2E] mb-2">Basic Info</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E]">Title</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E]">Subtitle</label>
          <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E]">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E]">Origin Section Description</label>
          <textarea
            value={form.originDescription}
            onChange={e => setForm(f => ({ ...f, originDescription: e.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]"
            placeholder="Enter the text for the Origin section on the Home page..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E]">Hero Image URL</label>
          <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-2">Areas of Expertise</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExpertise();
                }
              }}
              className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-[#1A0B2E] outline-none focus:border-[#D4AF37]"
              placeholder="Add a skill tag (e.g., Money Mindset)"
            />
            <button
              type="button"
              onClick={addExpertise}
              className="inline-flex items-center gap-1 rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D4AF37] hover:text-[#4B2E83]"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="mt-3 flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-[#1A0B2E]/10 bg-[#F8F9FA] p-3">
            {form.expertise.length === 0 ? (
              <span className="text-sm text-[#1A0B2E]/50">No expertise tags added yet.</span>
            ) : (
              form.expertise.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-semibold text-[#4B2E83]"
                >
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() => removeExpertise(index)}
                    className="rounded-full p-0.5 text-[#4B2E83]/80 transition-colors hover:bg-[#D4AF37]/20 hover:text-[#4B2E83]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      {message && <p className="text-sm text-[#1A0B2E]/80">{message}</p>}
      <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 px-6 py-3 rounded-none font-bold bg-[#4B2E83] text-white border-2 border-[#4B2E83] hover:bg-[#D4AF37] hover:text-[#4B2E83] hover:border-[#D4AF37] transition-all duration-300 uppercase tracking-wide text-sm disabled:cursor-not-allowed disabled:opacity-70">
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Basic Info"}
      </button>
    </form>
  );
}
