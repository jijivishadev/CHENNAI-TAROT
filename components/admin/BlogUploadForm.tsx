"use client";

import { useEffect, useState } from "react";
import { UploadCloud, X, PlusCircle, MinusCircle } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

// ✅ Type export – correct way
export type BlogUploadFormValues = {
  title: string;
  shortDescription: string;
  imageUrl: string;
  imageFile: File | null;
  keywords: string[];
  author: string;
  readTime: string;
  richContent: string;
};

type BlogUploadFormProps = {
  onSubmit: (values: BlogUploadFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  uploadProgress?: number | null;
  initialValues?: Partial<BlogUploadFormValues>;
  submitLabel?: string;
};

export default function BlogUploadForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  uploadProgress = null,
  initialValues,
  submitLabel,
}: BlogUploadFormProps) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [author, setAuthor] = useState("Jothi Ramesh");
  const [readTime, setReadTime] = useState("");
  const [richContent, setRichContent] = useState("<p>Start writing your blog post here...</p>");
  const [editorMode, setEditorMode] = useState<"visual" | "raw">("visual");
  const [showPreview, setShowPreview] = useState(false);
  const [localError, setLocalError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialValues) return;
    setTitle(initialValues.title ?? "");
    setShortDescription(initialValues.shortDescription ?? "");
    setImageUrl(initialValues.imageUrl ?? "");
    setImageFile(null);
    setKeywords(initialValues.keywords?.slice(0, 3) ?? []);
    setAuthor(initialValues.author ?? "Jothi Ramesh");
    setReadTime(initialValues.readTime ?? "");
    setRichContent(initialValues.richContent ?? "<p>Start writing your blog post here...</p>");
    setKeywordInput("");
  }, [initialValues]);

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const addKeyword = () => {
    const nextKeyword = keywordInput.trim();
    if (!nextKeyword) {
      setLocalError("Enter a keyword before adding it.");
      return;
    }
    if (keywords.length >= 3) {
      setLocalError("You can add a maximum of 3 keywords/tags.");
      return;
    }
    if (keywords.some((k) => k.toLowerCase() === nextKeyword.toLowerCase())) {
      setLocalError("That keyword is already added.");
      return;
    }
    setKeywords((prev) => [...prev, nextKeyword]);
    setKeywordInput("");
    setLocalError("");
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleHtmlFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isHtmlFile = file.name.toLowerCase().endsWith(".html") || file.type === "text/html";
    if (!isHtmlFile) {
      setLocalError("Please upload a valid .html file.");
      event.target.value = "";
      return;
    }

    try {
      const rawHtml = await file.text();
      setRichContent(rawHtml);
      setEditorMode("raw");
      setLocalError("");
    } catch (error) {
      console.error("Failed to read HTML file:", error);
      setLocalError("Could not read the selected HTML file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    if (!title.trim()) {
      setLocalError("Title is required.");
      return;
    }
    if (!shortDescription.trim()) {
      setLocalError("Short description is required.");
      return;
    }

    const normalizedHtml = richContent
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();

    if (!richContent.trim() || richContent === "<p><br></p>" || richContent === "<div><br></div>" || normalizedHtml.length === 0) {
      setLocalError("Blog content cannot be empty.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      imageUrl: imageUrl.trim(),
      imageFile,
      keywords: keywords.slice(0, 3),
      author: author.trim(),
      readTime: readTime.trim(),
      richContent: richContent.trim(),
    });
  };

  const previewImageUrl = previewImage || imageUrl || "/bannerimg.jpg";
  const previewBodyHtml = richContent.trim() || "<p>Start writing your blog post here...</p>";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1A0B2E]">
          {submitLabel === "Update Post" ? "Edit Blog Post" : "Create New Blog Post"}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Enter blog post title"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Enter a short intro used on blog cards"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-base font-medium text-[#1A0B2E]">
            <UploadCloud className="h-5 w-5 text-[#D4AF37]" />
            <span>Upload Blog Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFileChange(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E]"
          />
          <p className="mt-1 text-sm text-[#1A0B2E]/65">Select a file – it will upload to Firebase Storage.</p>
          {(previewImage || imageUrl) && (
            <div className="mt-2">
              <img src={previewImage || imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Fallback Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="https://example.com/blog-image.jpg"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="Author name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Read Time</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className="w-full rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="e.g. 8 min read"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-base font-medium text-[#1A0B2E]">Keywords / Tags (max 3)</label>
          <div className="space-y-3 rounded-lg border border-[#4B2E83]/20 bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="flex-1 rounded-lg border border-[#4B2E83]/20 px-4 py-3 text-base text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
                placeholder="Type a keyword and click +"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-3 text-base font-semibold text-[#1A0B2E]"
              >
                <PlusCircle className="h-5 w-5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#4B2E83] px-3 py-1.5 text-sm font-semibold text-[#F3ECFF]"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-[#1A0B2E]/65">
              <span>{keywords.length}/3 added</span>
              {keywords.length > 0 && (
                <button type="button" onClick={() => setKeywords([])} className="inline-flex items-center gap-1 font-semibold text-[#4B2E83]">
                  <MinusCircle className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#4B2E83]/15 bg-[#F3ECFF] p-1">
            <button
              type="button"
              onClick={() => setEditorMode("visual")}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${editorMode === "visual" ? "bg-[#4B2E83] text-white" : "text-[#4B2E83]"}`}
            >
              Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("raw")}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${editorMode === "raw" ? "bg-[#4B2E83] text-white" : "text-[#4B2E83]"}`}
            >
              Raw HTML Code
            </button>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-2 text-sm font-semibold text-[#4B2E83] transition hover:bg-[#D4AF37]/20">
            <UploadCloud className="h-4 w-4" />
            <span>Upload .html File</span>
            <input type="file" accept=".html,text/html" onChange={handleHtmlFileUpload} className="hidden" />
          </label>
        </div>

        {editorMode === "visual" ? (
          <RichTextEditor
            value={richContent}
            onChange={setRichContent}
            placeholder="Start writing your blog post here..."
          />
        ) : (
          <textarea
            value={richContent}
            onChange={(e) => setRichContent(e.target.value)}
            rows={18}
            className="w-full rounded-lg border border-[#4B2E83]/20 bg-white px-4 py-3 font-mono text-sm text-[#1A0B2E] outline-none focus:ring-2 focus:ring-[#4B2E83]/30"
            placeholder="<p>Paste HTML here...</p>"
          />
        )}
      </div>

      {uploadProgress !== null && (
        <div className="rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/12 px-3 py-2 text-sm text-[#4B2E83]">
          Uploading image: {uploadProgress}%
        </div>
      )}

      {localError && <p className="text-sm text-red-600">{localError}</p>}

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#D4AF37] px-7 py-3 text-base font-semibold text-[#1A0B2E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel ?? "Create Post"}
        </button>

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="rounded-lg border border-[#4B2E83]/25 bg-white px-7 py-3 text-base font-semibold text-[#4B2E83]"
        >
          👁️ Preview Blog
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#4B2E83]/25 px-7 py-3 text-base font-semibold text-[#4B2E83]"
        >
          Cancel
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-800">Blog Post Live Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors text-xl font-bold"
                aria-label="Close Preview"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 block [&_*]:block [&_span]:inline [&_a]:inline [&_strong]:inline [&_b]:inline [&_i]:inline [&_em]:inline">
              <div className="w-full max-w-5xl mx-auto">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#D4AF37]">
                  {readTime && <span>{readTime}</span>}
                  {keywords.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#4B2E83] px-2 py-1 text-[10px] text-white">
                      {tag}
                    </span>
                  ))}
                </div>

                <img
                  src={previewImageUrl}
                  alt={title || "Blog preview"}
                  className="mb-5 h-64 w-full rounded-2xl object-cover border border-[#D4AF37]/20"
                />

                <h1 className="mb-3 text-3xl font-bold text-[#4B2E83]">
                  {title || "Untitled Blog Post"}
                </h1>

                {author && (
                  <p className="mb-4 text-sm font-semibold uppercase text-gray-600">
                    By {author}
                  </p>
                )}

                <div
                  dangerouslySetInnerHTML={{ __html: previewBodyHtml }}
                  className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl border text-left overflow-y-auto block [&_*]:block [&_span]:inline [&_a]:inline [&_strong]:inline [&_b]:inline [&_i]:inline [&_em]:inline [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_p]:my-3 [&_p]:leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end border-t bg-gray-50 px-6 py-4 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}