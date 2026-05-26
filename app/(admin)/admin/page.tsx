"use client";

import { useEffect, useState } from "react";
import { BookText, Image as ImageIcon, FileText, Users, Phone, HelpCircle, Boxes, Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import {
  getAnnouncementBarContent,
  getHomeMessageContent,
  updateAnnouncementBarContent,
  updateHomeMessageContent,
} from "@/lib/firebaseServices";

// --- SHORTCUTS DASHBOARD ---
const shortcuts = [
  { label: "Image Manager", href: "/admin/image-manager", icon: ImageIcon },
  { label: "About Content", href: "/admin/about-content", icon: FileText },
  { label: "Events", href: "/admin/events", icon: Sparkles },
  // { label: "Hero Editor", href: "/admin/hero-editor", icon: SlidersHorizontal },
  { label: "Offers", href: "/admin/offers", icon: BookText },
  { label: "Pathways", href: "/admin/pathways", icon: Boxes },
  { label: "Testimonials", href: "/admin/testimonials", icon: Users },
  { label: "Contact Hub", href: "/admin/contact-hub", icon: Phone },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Survey", href: "/admin/survey", icon: FileText },

];

export default function AdminDashboardPage() {
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [messageTitle, setMessageTitle] = useState("");
  const [messageParagraph1, setMessageParagraph1] = useState("");
  const [messageParagraph2, setMessageParagraph2] = useState("");
  const [messageParagraph3, setMessageParagraph3] = useState("");
  const [isLoadingHomeMessage, setIsLoadingHomeMessage] = useState(true);
  const [isSavingHomeMessage, setIsSavingHomeMessage] = useState(false);
  const [homeMessageStatus, setHomeMessageStatus] = useState("");

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const data = await getAnnouncementBarContent();
        setAnnouncementText(data.text);
        setAnnouncementEnabled(data.isEnabled);
      } catch {
        setAnnouncementMessage("Could not load announcement data.");
      } finally {
        setIsLoadingAnnouncement(false);
      }
    };

    const loadHomeMessage = async () => {
      try {
        const data = await getHomeMessageContent();
        setMessageTitle(data.title);
        setMessageParagraph1(data.paragraphs[0] || "");
        setMessageParagraph2(data.paragraphs[1] || "");
        setMessageParagraph3(data.paragraphs[2] || "");
      } catch {
        setHomeMessageStatus("Could not load home message data.");
      } finally {
        setIsLoadingHomeMessage(false);
      }
    };

    loadAnnouncement();
    loadHomeMessage();
  }, []);

  const handleSaveAnnouncement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = announcementText.trim();

    if (trimmed.length === 0) {
      setAnnouncementMessage("Announcement text cannot be empty.");
      return;
    }

    setIsSavingAnnouncement(true);
    setAnnouncementMessage("");

    try {
      await updateAnnouncementBarContent({
        text: trimmed,
        isEnabled: announcementEnabled,
      });
      setAnnouncementText(trimmed);
      setAnnouncementMessage("Announcement updated successfully.");
    } catch {
      setAnnouncementMessage("Failed to save announcement. Please try again.");
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const handleSaveHomeMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = messageTitle.trim();
    const paragraphs = [messageParagraph1, messageParagraph2, messageParagraph3]
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (!trimmedTitle) {
      setHomeMessageStatus("Message title cannot be empty.");
      return;
    }

    if (paragraphs.length === 0) {
      setHomeMessageStatus("Add at least one paragraph.");
      return;
    }

    setIsSavingHomeMessage(true);
    setHomeMessageStatus("");

    try {
      await updateHomeMessageContent({
        title: trimmedTitle,
        paragraphs,
      });
      setMessageTitle(trimmedTitle);
      setMessageParagraph1(paragraphs[0] || "");
      setMessageParagraph2(paragraphs[1] || "");
      setMessageParagraph3(paragraphs[2] || "");
      setHomeMessageStatus("Home message updated successfully.");
    } catch {
      setHomeMessageStatus("Failed to save home message. Please try again.");
    } finally {
      setIsSavingHomeMessage(false);
    }
  };

  return (
    <section className="min-h-full w-full bg-gradient-to-br from-[#F3ECFF] via-[#F8F9FA] to-[#e6e0f7] text-[#1A0B2E] px-4 py-8 sm:px-6 md:px-8 md:py-12 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4B2E83] mb-10 text-center drop-shadow-sm tracking-tight">Admin Shortcuts</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {shortcuts.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[#D4AF37]/20 bg-white/90 p-8 shadow-lg transition-all group overflow-hidden hover:scale-[1.03] hover:shadow-2xl focus:ring-2 focus:ring-[#D4AF37] lg:p-10"
              style={{ minHeight: 200 }}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#D4AF37]/10 blur-2xl opacity-60 pointer-events-none" />
              <item.icon className="h-10 w-10 text-[#D4AF37] group-hover:text-[#4B2E83] transition-colors drop-shadow-md" />
              <span className="text-xl font-bold text-[#1A0B2E] group-hover:text-[#4B2E83] tracking-wide text-center drop-shadow-sm">
                {item.label}
              </span>
              <span className="absolute bottom-4 right-4 text-xs text-[#D4AF37]/60 opacity-0 group-hover:opacity-100 transition-opacity">Go to {item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-[#D4AF37]/25 bg-white/90 p-6 shadow-lg sm:p-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#4B2E83]">Announcement Bar</h2>
              <p className="mt-1 text-sm text-[#333333]">Update the announcement text shown at the top of the live site.</p>
            </div>

            {isLoadingAnnouncement ? (
              <p className="text-sm text-[#4B2E83]/70">Loading announcement settings...</p>
            ) : (
              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Announcement text</span>
                  <textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    placeholder="Enter announcement message"
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#4B2E83]">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-[#4B2E83]/35 text-[#4B2E83] focus:ring-[#D4AF37]"
                  />
                  Show announcement bar on site
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingAnnouncement}
                    className="inline-flex items-center rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-5 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#3D2468] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingAnnouncement ? "Saving..." : "Save Announcement"}
                  </button>
                  {announcementMessage ? (
                    <span className="text-sm text-[#4B2E83]">{announcementMessage}</span>
                  ) : null}
                </div>
              </form>
            )}
          </section>

          <section className="rounded-2xl border border-[#D4AF37]/25 bg-white/90 p-6 shadow-lg sm:p-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#4B2E83]">Home Message</h2>
              <p className="mt-1 text-sm text-[#333333]">Update the "A Message From The Coach" section on the home page.</p>
            </div>

            {isLoadingHomeMessage ? (
              <p className="text-sm text-[#4B2E83]/70">Loading home message settings...</p>
            ) : (
              <form onSubmit={handleSaveHomeMessage} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Section title</span>
                  <input
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    placeholder="A Message From The Coach"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Paragraph 1</span>
                  <textarea
                    value={messageParagraph1}
                    onChange={(e) => setMessageParagraph1(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Paragraph 2</span>
                  <textarea
                    value={messageParagraph2}
                    onChange={(e) => setMessageParagraph2(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Paragraph 3</span>
                  <textarea
                    value={messageParagraph3}
                    onChange={(e) => setMessageParagraph3(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingHomeMessage}
                    className="inline-flex items-center rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-5 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#3D2468] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingHomeMessage ? "Saving..." : "Save Home Message"}
                  </button>
                  {homeMessageStatus ? <span className="text-sm text-[#4B2E83]">{homeMessageStatus}</span> : null}
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
