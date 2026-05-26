"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EmailCaptureModal({ open, onClose }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
        page: "about",
      });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
        <button
          aria-label="Close modal"
          className="absolute top-3 right-3 text-[#4B2E83] hover:text-[#D4AF37] text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-2 text-[#4B2E83]">Join the List</h3>
        <p className="mb-4 text-[#1A0B2E]/80 text-sm">Get updates & insights. No spam.</p>
        {success ? (
          <div className="text-green-600 font-semibold py-4 text-center">Thank you for subscribing!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 py-2 border border-[#D4AF37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="w-full py-2 px-6 rounded-none font-bold bg-[#4B2E83] text-white border-2 border-[#4B2E83] hover:bg-[#D4AF37] hover:text-[#4B2E83] hover:border-[#D4AF37] transition-all duration-300 uppercase tracking-wide text-sm"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Subscribe"}
            </button>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
