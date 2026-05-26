"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { uploadStorageFile } from "@/lib/firebaseServices";

type ImageUploadProps = {
  title: string;
  description: string;
  currentUrl?: string;
  storagePath: string;
  onUploadComplete: (url: string) => void;
  buttonLabel: string;
};

export default function ImageUpload({
  title,
  description,
  currentUrl,
  storagePath,
  onUploadComplete,
  buttonLabel,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewUrl = localPreview || currentUrl || "";

  const previewFrame = useMemo(
    () => "relative w-full aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden border border-[#1A0B2E]/10 shadow-[0_10px_30px_rgba(20,20,30,0.08)]",
    []
  );

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleSelectFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    setUploading(true);
    setError(null);

    const temporaryPreview = URL.createObjectURL(file);
    setLocalPreview(temporaryPreview);

    try {
      const downloadUrl = await uploadStorageFile(storagePath, file);
      onUploadComplete(downloadUrl);
      setLocalPreview(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(temporaryPreview);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <h3 className="text-2xl font-bold text-[#1A0B2E]">{title}</h3>
          <p className="mt-2 text-sm text-[#1A0B2E]/70">{description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-none border border-[#D4AF37] bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-[#1A0B2E] transition-colors hover:bg-[#c59d23] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UploadCloud className="h-4 w-4" />
              {buttonLabel}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void handleSelectFile(file);
                event.target.value = "";
              }}
            />
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className={previewFrame}>
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 420px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center text-[#1A0B2E]/45">
              <div>
                <ImageIcon className="mx-auto h-10 w-10" />
                <p className="mt-3 text-sm font-medium">No image uploaded yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
