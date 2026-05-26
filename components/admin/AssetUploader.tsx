"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { UploadCloud, Image as ImageIcon, FileCheck, AlertTriangle, Link as LinkIcon, MoreVertical, Trash2, SquarePen, Save } from "lucide-react";
import { deleteSiteAssetUrl, getSiteAssets, saveSiteAssetUrl, uploadSiteAssetFile } from "@/lib/firebaseServices";

type AssetUploaderProps = {
  title: string;
  description: string;
  firestoreField: string;
  storagePath: string;
  onUpload?: (url: string) => void;
};

const AssetUploader: React.FC<AssetUploaderProps> = ({ title, description, firestoreField, storagePath, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const validateAndSetFile = useCallback((nextFile: File | null) => {
    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (nextFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(nextFile);
    setError(null);
    setProgress(0);
  }, []);

  useEffect(() => {
    const fetchCurrentUrl = async () => {
      const assets = await getSiteAssets();
      const assetValue = assets[firestoreField as keyof typeof assets];
      if (typeof assetValue === "string" && assetValue) {
        const url = assetValue;
        setCurrentUrl(url);
        setUrlInput(url);
      }
    };
    fetchCurrentUrl().catch(console.error);
  }, [firestoreField]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const preview = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    validateAndSetFile(droppedFile);
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const downloadURL = await uploadSiteAssetFile({
        field: firestoreField,
        storagePath,
        file,
        onProgress: (value) => setProgress(value),
      });

      setCurrentUrl(downloadURL);
      setUrlInput(downloadURL);
      setFile(null);
      setProgress(100);
      setIsEditingUrl(false);
      if (onUpload) onUpload(downloadURL);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveExternalUrl = async (): Promise<void> => {
    const normalizedUrl = urlInput.trim();

    if (!normalizedUrl) {
      setError("Please enter an image URL.");
      return;
    }

    const isHttpUrl = /^https?:\/\//i.test(normalizedUrl);
    if (!isHttpUrl) {
      setError("URL must start with http:// or https://");
      return;
    }

    setError(null);
    setIsSavingUrl(true);

    try {
      await saveSiteAssetUrl(firestoreField, normalizedUrl);

      setCurrentUrl(normalizedUrl);
      setFile(null);
      setProgress(0);
      setIsEditingUrl(false);
      if (onUpload) onUpload(normalizedUrl);
    } catch {
      setError("Failed to save URL. Please try again.");
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleDeleteAsset = async (): Promise<void> => {
    setError(null);

    try {
      await deleteSiteAssetUrl(firestoreField);
      setCurrentUrl(null);
      setUrlInput("");
      setFile(null);
      setProgress(0);
      setIsEditingUrl(false);
      setIsMenuOpen(false);
    } catch {
      setError("Failed to delete asset. Please try again.");
    }
  };
  
  const displayUrl = preview || currentUrl;
  const isOriginImageField = firestoreField === "originImageUrl1" || firestoreField === "originImageUrl2";
  const previewFrameClass = isOriginImageField
    ? "w-full max-w-[600px] aspect-[3/4] bg-[#F8F9FA] rounded-lg overflow-hidden flex justify-center items-center border border-[#1A0B2E]/10"
    : "w-full h-48 bg-[#F8F9FA] rounded-lg overflow-hidden flex justify-center items-center border border-[#1A0B2E]/10";
  const imageClass = isOriginImageField ? "rounded-md object-contain" : "rounded-md object-cover";

  return (
    <div className="relative w-full rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
      <div className="absolute right-4 top-4" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-none border border-[#1A0B2E]/10 text-[#1A0B2E]/70 transition-colors hover:bg-[#F8F9FA]"
          aria-label="Open asset options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-[#1A0B2E]/10 bg-white p-2 shadow-xl">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingUrl(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#1A0B2E] transition-colors hover:bg-[#F8F9FA]"
                >
                  <SquarePen className="h-4 w-4" /> Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAsset}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </motion.div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-none border border-[#D4AF37] bg-white px-3 text-sm font-semibold text-[#1A0B2E] transition-colors hover:bg-[#F8F9FA]"
              >
                <UploadCloud className="h-4 w-4 text-[#D4AF37]" />
                Upload Local File
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Side: Details & Uploader */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <h3 className="text-xl font-bold text-[#1A0B2E]">{title}</h3>
          <p className="mt-1 text-sm text-[#1A0B2E]/70">{description}</p>
          
          <motion.div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            className={`mt-4 relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              isDragging ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-[#1A0B2E]/20 bg-[#F8F9FA]"
            }`}
          >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="sr-only" disabled={isUploading} />
                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div key="file-selected" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                            <FileCheck className="h-8 w-8 text-green-400 mx-auto" />
                            <p className="mt-2 text-xs font-semibold text-[#1A0B2E] truncate max-w-full px-2">{file.name}</p>
                        </motion.div>
                    ) : (
                        <motion.div key="no-file" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                            <UploadCloud className="h-8 w-8 text-[#1A0B2E]/50 mx-auto" />
                            <p className="mt-2 text-xs text-[#1A0B2E]/70">Drop image or click to browse</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="mt-4 rounded-lg border border-[#1A0B2E]/15 bg-[#F8F9FA] p-3">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#1A0B2E]/80">
                <LinkIcon className="h-4 w-4 text-[#D4AF37]" />
                External Image URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-[#1A0B2E]/20 bg-white px-3 py-2 text-sm text-[#1A0B2E] outline-none transition-colors focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handleSaveExternalUrl}
                disabled={isSavingUrl}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-none border border-[#D4AF37] bg-[#D4AF37] px-3 text-sm font-semibold text-[#1A0B2E] transition-colors hover:bg-[#c59d23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSavingUrl ? "Saving URL..." : "Save URL"}
              </button>
            </div>
        </div>

        {/* Right Side: Preview & Actions */}
        <div className="w-full md:w-2/3 flex flex-col items-center gap-4">
            <motion.div layout className={previewFrameClass}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayUrl || 'placeholder'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {displayUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={displayUrl}
                        alt={`${title} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className={imageClass}
                        priority
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-full text-white/30">
                      <ImageIcon className="h-12 w-12" />
                      <p className="text-xs mt-2 font-semibold">Current Image</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {isUploading && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full space-y-1.5">
                    <p className="text-xs font-semibold text-center text-[#D4AF37]">Uploading: {Math.round(progress)}%</p>
                    <div className="w-full bg-[#1A0B2E]/10 rounded-full h-2 overflow-hidden">
                        <motion.div className="bg-gradient-to-r from-[#D4AF37] to-yellow-300 h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-red-400 text-xs flex items-center gap-1.5 justify-center"><AlertTriangle size={14} />{error}</p>}

            <motion.button
                onClick={handleUpload}
                disabled={!file || isUploading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              className="w-full h-11 flex items-center justify-center rounded-none border border-[#D4AF37] bg-[#D4AF37] px-4 text-sm font-bold text-[#1A0B2E] disabled:cursor-not-allowed disabled:border-[#D4AF37]/30 disabled:bg-[#D4AF37]/30 disabled:text-white/40"
            >
              {isUploading ? "Uploading Local..." : "Upload Local"}
            </motion.button>

            {isEditingUrl && (
              <p className="text-xs text-[#1A0B2E]/60">Edit mode enabled. Update URL above or upload a new file.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AssetUploader;
