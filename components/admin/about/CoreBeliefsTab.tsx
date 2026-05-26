// components/admin/about/CoreBeliefsTab.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, Heart } from "lucide-react";
import { 
  getCoreBeliefs, 
  addCoreBelief, 
  updateCoreBelief, 
  deleteCoreBelief 
} from "@/lib/firebaseServices";

interface CoreBelief {
  id: string;
  title: string;
  description: string;
  order: number;
}

export default function CoreBeliefsTab() {
  const [beliefs, setBeliefs] = useState<CoreBelief[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBelief, setEditingBelief] = useState<CoreBelief | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBeliefs();
  }, []);

  const fetchBeliefs = async () => {
    setLoading(true);
    try {
      const data = await getCoreBeliefs();
      console.log("Fetched core beliefs:", data);
      setBeliefs(data);
    } catch (error) {
      console.error("Error fetching core beliefs:", error);
      setMessage({ type: "error", text: "Failed to load beliefs" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Omit<CoreBelief, "id" | "order">) => {
    setSaving(true);
    try {
      if (editingBelief) {
        await updateCoreBelief(editingBelief.id, formData);
        setMessage({ type: "success", text: "Belief updated successfully!" });
      } else {
        await addCoreBelief({
          ...formData,
          order: beliefs.length + 1,
        });
        setMessage({ type: "success", text: "Belief added successfully!" });
      }
      setShowForm(false);
      setEditingBelief(null);
      await fetchBeliefs();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving belief:", error);
      setMessage({ type: "error", text: "Failed to save belief" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this belief?")) {
      try {
        await deleteCoreBelief(id);
        await fetchBeliefs();
        setMessage({ type: "success", text: "Belief deleted successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting belief:", error);
        setMessage({ type: "error", text: "Failed to delete belief" });
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-8 text-center">
        <div className="animate-pulse">Loading core beliefs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1A0B2E]">Core Beliefs</h2>
          <p className="text-sm text-[#1A0B2E]/60 mt-1">
            {beliefs.length} belief(s) found
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBelief(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Belief
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
            <CoreBeliefForm
              initialData={editingBelief}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingBelief(null);
              }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {beliefs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D4AF37]/30 bg-[#F8F9FA] p-12 text-center">
          <p className="text-[#1A0B2E]/50">No core beliefs yet. Click "Add New Belief" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beliefs.map((belief) => (
            <motion.div
              key={belief.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl border border-[#1A0B2E]/10 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingBelief(belief);
                      setShowForm(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-[#D4AF37]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(belief.id)}
                    className="p-1.5 rounded-lg bg-[#F8F9FA] hover:bg-red-100 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Heart className="h-8 w-8 text-[#D4AF37] mb-3" />
                <h3 className="text-xl font-bold text-[#1A0B2E] mb-2">{belief.title}</h3>
                <p className="text-sm text-[#1A0B2E]/70">{belief.description}</p>
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

function CoreBeliefForm({ initialData, onSave, onCancel, saving }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });

  return (
    <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-6 mb-6">
      <h3 className="text-lg font-bold text-[#1A0B2E] mb-4">
        {initialData ? "Edit Core Belief" : "Add New Core Belief"}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="e.g., Overcoming Fear"
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

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.title || !formData.description}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : initialData ? "Update Belief" : "Add Belief"}
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