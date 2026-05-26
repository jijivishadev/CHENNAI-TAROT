// components/admin/about/EarlyLifeTab.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, ChevronUp, ChevronDown } from "lucide-react";
import { 
  getEarlyLifeCards, 
  addEarlyLifeCard, 
  updateEarlyLifeCard, 
  deleteEarlyLifeCard,
  reorderEarlyLifeCards 
} from "@/lib/firebaseServices";
import dynamic from 'next/dynamic';
const AssetUploader = dynamic(() => import('../AssetUploader'), { ssr: false, loading: () => <div>Loading…</div> });
import Image from "next/image";

interface EarlyLifeCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export default function EarlyLifeTab() {
  const [cards, setCards] = useState<EarlyLifeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<EarlyLifeCard | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const data = await getEarlyLifeCards();
      console.log("Fetched early life cards:", data);
      setCards(data);
    } catch (error) {
      console.error("Error fetching early life cards:", error);
      setMessage({ type: "error", text: "Failed to load cards" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Omit<EarlyLifeCard, "id" | "order">) => {
    setSaving(true);
    try {
      if (editingCard) {
        await updateEarlyLifeCard(editingCard.id, formData);
        setMessage({ type: "success", text: "Card updated successfully!" });
      } else {
        await addEarlyLifeCard({
          ...formData,
          order: cards.length + 1,
        });
        setMessage({ type: "success", text: "Card added successfully!" });
      }
      setShowForm(false);
      setEditingCard(null);
      await fetchCards(); // Refresh after save
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving card:", error);
      setMessage({ type: "error", text: "Failed to save card" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteEarlyLifeCard(id);
        await fetchCards();
        setMessage({ type: "success", text: "Card deleted successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting card:", error);
        setMessage({ type: "error", text: "Failed to delete card" });
      }
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const index = cards.findIndex(c => c.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === cards.length - 1)) return;

    const newCards = [...cards];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];

    const updates = newCards.map((card, idx) => ({ id: card.id, order: idx + 1 }));
    try {
      await reorderEarlyLifeCards(updates);
      setCards(newCards);
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-8 text-center">
        <div className="animate-pulse">Loading early life cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1A0B2E]">Early Life & Spiritual Awakening</h2>
          <p className="text-sm text-[#1A0B2E]/60 mt-1">
            {cards.length} card(s) found
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Card
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <EarlyLifeForm
              initialData={editingCard}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingCard(null);
              }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D4AF37]/30 bg-[#F8F9FA] p-12 text-center">
          <p className="text-[#1A0B2E]/50">No early life cards yet. Click "Add New Card" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl border border-[#1A0B2E]/10 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleReorder(card.id, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#D4AF37]/10 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(card.id, "down")}
                    disabled={index === cards.length - 1}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#D4AF37]/10 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCard(card);
                      setShowForm(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#D4AF37]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {card.imageUrl && (
                  <div className="mb-4 h-32 w-full rounded-xl overflow-hidden bg-[#F8F9FA]">
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      sizes="200px"
                      placeholder="blur"
                      blurDataURL="/placeholder-blur.png"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A0B2E] mb-2">{card.title}</h3>
                <p className="text-sm text-[#1A0B2E]/70 line-clamp-3">{card.description}</p>
                <div className="mt-3 text-xs text-[#D4AF37]">Order: {card.order}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {message && (
        <div className={`fixed bottom-4 right-4 rounded-lg px-4 py-2 text-sm ${
          message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

function EarlyLifeForm({ initialData, onSave, onCancel, saving }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
  });

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-6 mb-6">
      <h3 className="text-lg font-bold text-[#1A0B2E] mb-4">
        {initialData ? "Edit Early Life Card" : "Add New Early Life Card"}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="e.g., Childhood Influences"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="Enter description..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-2">Card Image (Optional)</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-3">
              <Image
                src={formData.imageUrl}
                alt="Preview"
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-cover"
                sizes="80px"
                placeholder="blur"
                blurDataURL="/placeholder-blur.png"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.title || !formData.description}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : initialData ? "Update Card" : "Add Card"}
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1A0B2E]/20 px-6 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#F8F9FA]"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}