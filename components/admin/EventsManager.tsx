"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link as LinkIcon, Save, UploadCloud, X } from "lucide-react";
import { getPromotionalEvent, updatePromotionalEvent, uploadStorageFile } from "@/lib/firebaseServices";
import type { PromotionalEvent } from "@/types";

type EventFormState = {
  bannerImageUrl: string;
  redirectLink: string;
  isActive: boolean;
};

const EVENT_STORAGE_PATH = "events/promotional-banner";

export default function EventsManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [currentEvent, setCurrentEvent] = useState<PromotionalEvent | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [formState, setFormState] = useState<EventFormState>({
    bannerImageUrl: "",
    redirectLink: "",
    isActive: true,
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const record = await getPromotionalEvent();
        setCurrentEvent(record);
        setFormState({
          bannerImageUrl: record?.bannerImageUrl ?? "",
          redirectLink: record?.redirectLink ?? "",
          isActive: record?.isActive ?? true,
        });
      } catch (loadError) {
        console.error("[EventsManager] Failed to load event:", loadError);
        setError("Failed to load the promotional event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, []);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const bannerPreview = useMemo(() => localPreview || formState.bannerImageUrl || currentEvent?.bannerImageUrl || "", [currentEvent?.bannerImageUrl, formState.bannerImageUrl, localPreview]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const nextPreview = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalPreview(nextPreview);
    setError(null);
    setMessage("");
    event.target.value = "";
  };

  const resetForm = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setSelectedFile(null);
    setLocalPreview(null);
    setError(null);
    setMessage("");
    setFormState({
      bannerImageUrl: currentEvent?.bannerImageUrl ?? "",
      redirectLink: currentEvent?.redirectLink ?? "",
      isActive: currentEvent?.isActive ?? true,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage("");

    const redirectLink = formState.redirectLink.trim();
    if (!redirectLink) {
      setError("A redirection link is required.");
      return;
    }

    let bannerImageUrl = formState.bannerImageUrl.trim();

    if (selectedFile) {
      try {
        bannerImageUrl = await uploadStorageFile(EVENT_STORAGE_PATH, selectedFile);
      } catch (uploadError) {
        console.error("[EventsManager] Upload failed:", uploadError);
        setError("Banner upload failed. Please try again.");
        return;
      }
    }

    if (!bannerImageUrl) {
      setError("Please upload a banner image.");
      return;
    }

    setSaving(true);

    try {
      await updatePromotionalEvent({
        bannerImageUrl,
        redirectLink,
        isActive: formState.isActive,
      });

      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }

      const savedEvent: PromotionalEvent = {
        id: currentEvent?.id ?? "promotional_event",
        bannerImageUrl,
        redirectLink,
        isActive: formState.isActive,
        updatedAt: Date.now(),
      };

      setCurrentEvent(savedEvent);
      setFormState({
        bannerImageUrl,
        redirectLink,
        isActive: formState.isActive,
      });
      setSelectedFile(null);
      setLocalPreview(null);
      setMessage("Promotional event updated successfully.");
    } catch (saveError) {
      console.error("[EventsManager] Failed to save event:", saveError);
      setError("Failed to save the promotional event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBFF] p-4 text-[#1A0B2E] md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold md:text-5xl">
          Promotional <span className="italic text-[#D4AF37]">Events</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#1A0B2E]/60">
          Manage the home-page event banner, link destination, and site visibility from one place.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)] md:p-8">
          <div className="space-y-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">Banner Image</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-[#1A0B2E] transition-colors hover:bg-[#c99f21]"
                >
                  <UploadCloud className="h-4 w-4" />
                  Upload Banner Image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                <span className="text-sm text-[#1A0B2E]/55">Recommended: 1600 x 900 or similar landscape ratio.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">Redirection Link</label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#1A0B2E]/10 bg-[#F8F9FA] px-4 py-3 focus-within:border-[#D4AF37]">
                <LinkIcon className="h-4 w-4 text-[#D4AF37]" />
                <input
                  type="url"
                  value={formState.redirectLink}
                  onChange={(event) => setFormState((prev) => ({ ...prev, redirectLink: event.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-transparent text-base outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[#1A0B2E]/10 bg-[#F8F9FA] px-4 py-3 text-sm font-semibold text-[#1A0B2E]/80">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) => setFormState((prev) => ({ ...prev, isActive: event.target.checked }))}
                className="h-4 w-4 accent-[#D4AF37]"
              />
              Show event pop-up on the home page
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-full bg-[#1A0B2E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4B2E83] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Event"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-[#1A0B2E]/15 px-6 py-3 font-semibold text-[#1A0B2E] transition-colors hover:bg-[#F8F9FA]"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)] md:p-8"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1A0B2E]">Preview</h2>
              <p className="text-sm text-[#1A0B2E]/55">This is the image and link the home-page overlay will use.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${formState.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {formState.isActive ? "Active" : "Hidden"}
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#1A0B2E]/10 bg-[#F8F9FA]">
            <div className="relative aspect-[16/10] w-full">
              {bannerPreview ? (
                <Image src={bannerPreview} alt="Promotional event banner" fill sizes="(max-width: 768px) 100vw, 50rem" className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-[#1A0B2E]/45">
                  No banner image selected yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#1A0B2E]/70">
            <p>
              <span className="font-semibold text-[#1A0B2E]">Current link:</span> {formState.redirectLink || "Not set"}
            </p>
            <p>
              <span className="font-semibold text-[#1A0B2E]">Saved image:</span> {currentEvent?.bannerImageUrl ? "Available" : "None yet"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}