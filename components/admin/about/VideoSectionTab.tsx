"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Image as ImageIcon, Save, UploadCloud, Video, Link as LinkIcon } from "lucide-react";
import { getVideoSection, updateVideoSection } from "@/lib/firebaseServices";
import { storage } from "@/lib/firebase";
import type { VideoSection } from "@/types";

// Helper function to extract video URL from embed code
function extractVideoUrlFromEmbed(embedCode: string): string {
  // Check if it's already a direct URL
  if (embedCode.match(/^https?:\/\/(player\.vimeo\.com|www\.youtube\.com|youtu\.be)/i)) {
    return embedCode.trim();
  }
  
  // Extract from Vimeo embed iframe
  const vimeoMatch = embedCode.match(/src="https:\/\/player\.vimeo\.com\/video\/(\d+)[^"]*"/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // Return as is if no extraction needed
  return embedCode.trim();
}

export default function VideoSectionTab() {
  const [formData, setFormData] = useState<VideoSection>({
    videoUrl: "",
    title: "",
    description: "",
    thumbnailUrl: "",
  });
  const [embedCodeInput, setEmbedCodeInput] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoSection();
  }, []);

  const fetchVideoSection = async () => {
    setLoading(true);
    try {
      const data = await getVideoSection();
      console.log("Fetched video section:", data);
      setFormData(data);
      setThumbnailPreview(data.thumbnailUrl || null);
      if (data.videoUrl) {
        setEmbedCodeInput(data.videoUrl);
      }
    } catch (error) {
      console.error("Error fetching video section:", error);
      setMessage("Failed to load video section");
    } finally {
      setLoading(false);
    }
  };

  const handleEmbedCodeChange = (code: string) => {
    setEmbedCodeInput(code);
    // Extract URL from embed code and update formData
    const extractedUrl = extractVideoUrlFromEmbed(code);
    setFormData((prev) => ({ ...prev, videoUrl: extractedUrl }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateVideoSection(formData);
      setMessage("Video section saved successfully!");
      console.log("Video section saved:", formData);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving video section:", error);
      setMessage("Failed to save video section");
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setThumbnailPreview(localPreview);
    setUploadingThumbnail(true);
    setMessage(null);

    try {
      const storageRef = ref(storage, `about/video-thumbnail/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          undefined,
          (error) => reject(error),
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });

      setFormData((prev) => ({ ...prev, thumbnailUrl: uploadedUrl }));
      setThumbnailPreview(uploadedUrl);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setMessage("Failed to upload thumbnail image");
    } finally {
      setUploadingThumbnail(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-8 text-center">
        <div className="animate-pulse">Loading video section...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <Video className="h-6 w-6 text-[#D4AF37]" />
        <h2 className="text-xl font-bold text-[#1A0B2E]">Video Section</h2>
      </div>

      <div className="space-y-4">
        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Thumbnail Image (Optional)</label>
          <div className="rounded-xl border border-[#1A0B2E]/20 bg-[#F8F9FA] p-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#1A0B2E]/25 bg-white px-4 py-3 text-sm font-medium text-[#1A0B2E] hover:border-[#D4AF37]">
              <UploadCloud className="h-4 w-4 text-[#D4AF37]" />
              {uploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploadingThumbnail}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleThumbnailUpload(file);
                  }
                }}
              />
            </label>

            <input
              type="url"
              value={formData.thumbnailUrl || ""}
              onChange={(e) => {
                const nextUrl = e.target.value;
                setFormData((prev) => ({ ...prev, thumbnailUrl: nextUrl }));
                setThumbnailPreview(nextUrl || null);
              }}
              className="mt-3 w-full rounded-lg border border-[#1A0B2E]/20 bg-white px-3 py-2 focus:border-[#D4AF37] outline-none"
              placeholder="https://example.com/thumbnail.jpg"
            />

            <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-[#1A0B2E]/10 bg-white">
              {thumbnailPreview ? (
                <div className="relative h-full w-full">
                  <Image
                    src={thumbnailPreview}
                    alt="Video thumbnail preview"
                    fill
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#1A0B2E]/45">
                  <ImageIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm">No thumbnail selected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="e.g., Global Legacy"
            required
          />
        </div>

        {/* Embed Code Input - NEW */}
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">
            Video Embed Code or URL
          </label>
          <div className="space-y-2">
            <textarea
              value={embedCodeInput}
              onChange={(e) => handleEmbedCodeChange(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none font-mono text-sm"
              placeholder='Paste Vimeo/YouTube embed code or URL here...'
            />
            <p className="text-xs text-[#1A0B2E]/50">
              Paste the full embed code from Vimeo or YouTube, or just the video URL.
              The video URL will be automatically extracted.
            </p>
          </div>
        </div>

        {/* Extracted URL Preview */}
        {formData.videoUrl && (
          <div className="rounded-lg bg-[#F3ECFF] p-3">
            <p className="text-xs font-semibold text-[#4B2E83] mb-1">Extracted Video URL:</p>
            <p className="text-xs text-[#1A0B2E]/70 break-all">{formData.videoUrl}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="Enter video description..."
            required
          />
        </div>

        {/* Video Preview */}
        {formData.videoUrl && (
          <div className="mt-4 p-4 bg-[#F8F9FA] rounded-lg">
            <p className="text-xs text-[#1A0B2E]/60 mb-2">Preview:</p>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {formData.thumbnailUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              ) : (
                <iframe
                  src={formData.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Preview"
                />
              )}
            </div>
          </div>
        )}

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-none bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Video Section"}
        </button>
      </div>
    </div>
  );
}