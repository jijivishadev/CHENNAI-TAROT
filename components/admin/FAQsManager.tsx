"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import {
  createFaq,
  updateFaq,
  deleteFaq,
  getFaqs,
  FAQRecord,
} from "@/lib/firebaseServices";

type FAQFormState = {
  question: string;
  answer: string;
  order: number;
};

export default function FAQsManager() {
  const [faqs, setFaqs] = useState<FAQRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQRecord | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FAQFormState>({
    question: "",
    answer: "",
    order: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getFaqs({ fallbackToLocal: false });
      const sorted = [...items].sort((a, b) => a.order - b.order);
      setFaqs(sorted);
      console.log("[FAQsManager] FAQs loaded:", items.length);
    } catch (err) {
      console.error("[FAQsManager] Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setEditingFaqId(null);
    setFormState({
      question: "",
      answer: "",
      order: faqs.length,
    });
    setShowModal(true);
  };

  const openEditModal = (faq: FAQRecord) => {
    setEditingFaq(faq);
    setEditingFaqId(faq.id);
    setFormState({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaq(null);
    setEditingFaqId(null);
    setFormState({ question: "", answer: "", order: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.question.trim() || !formState.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (editingFaq && editingFaqId) {
        const safeOrder = Number.isFinite(formState.order) ? Math.max(0, Math.trunc(formState.order)) : editingFaq.order;
        await updateFaq(editingFaqId, {
          question: formState.question,
          answer: formState.answer,
          order: safeOrder,
        });
      } else {
        const safeOrder = Number.isFinite(formState.order) ? Math.max(0, Math.trunc(formState.order)) : faqs.length;
        await createFaq({
          question: formState.question,
          answer: formState.answer,
          order: safeOrder,
        });
      }
      await fetchFAQs();
      closeModal();
    } catch (err) {
      console.error("[FAQsManager] Error submitting FAQ:", err);
      setError("Failed to save FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await deleteFaq(id);
      await fetchFAQs();
    } catch (err) {
      console.error("[FAQsManager] Error deleting FAQ:", err);
      setError("Failed to delete FAQ. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">FAQs Manager</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage frequently asked questions. Changes sync to the live site instantly.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-[#4B2E83] transition-colors hover:opacity-90"
        >
          <Plus size={20} />
          Add New FAQ
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-8 text-center text-gray-600">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-8 text-center text-gray-600">
            No FAQs yet. Click &quot;Add New FAQ&quot; to create one.
          </div>
        ) : (
          faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start justify-between gap-4 rounded-lg bg-[#001F3F] border border-[#D4AF37]/20 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-block rounded bg-[#D4AF37]/20 px-2.5 py-1 text-xs font-semibold text-[#D4AF37]">
                    #{faq.order}
                  </span>
                  <h3 className="font-semibold text-[#D4AF37]">
                    {faq.question}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-[#F3ECFF]/80">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(faq)}
                  className="rounded-lg bg-[#D4AF37]/10 p-2 text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-3xl rounded-2xl bg-white p-12 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900">
                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-7">
                {/* Question */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={formState.question}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3 text-base transition-colors focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    placeholder="Enter the question..."
                    autoFocus
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Answer
                  </label>
                  <textarea
                    value={formState.answer}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
                    rows={6}
                    className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3 text-base transition-colors focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    placeholder="Enter the answer..."
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-base font-semibold text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formState.order}
                    onChange={(e) =>
                      setFormState((prev) => {
                        const next = Number.parseInt(e.target.value, 10);
                        return {
                          ...prev,
                          order: Number.isFinite(next) ? next : prev.order,
                        };
                      })
                    }
                    className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3 text-base transition-colors focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    min="0"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-[#4B2E83] transition-colors hover:opacity-90 disabled:opacity-50 text-base"
                  >
                    {submitting
                      ? editingFaq
                        ? "Saving..."
                        : "Creating..."
                      : editingFaq
                        ? "Save FAQ"
                        : "Create FAQ"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
