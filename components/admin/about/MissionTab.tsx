// components/admin/about/MissionTab.tsx
"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Target } from "lucide-react";
import { getMissionSection, updateMissionSection } from "@/lib/firebaseServices";

export default function MissionTab() {
  const [formData, setFormData] = useState({
    title: "",
    items: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchMission();
  }, []);

  const fetchMission = async () => {
    setLoading(true);
    try {
      const data = await getMissionSection();
      console.log("Fetched mission section:", data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching mission section:", error);
      setMessage("Failed to load mission section");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateMissionSection(formData);
      setMessage("Mission section saved successfully!");
      console.log("Mission section saved:", formData);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving mission section:", error);
      setMessage("Failed to save mission section");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem.trim()]
      }));
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-8 text-center">
        <div className="animate-pulse">Loading mission section...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-[#D4AF37]" />
        <h2 className="text-xl font-bold text-[#1A0B2E]">Mission Section</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-1">Section Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 focus:border-[#D4AF37] outline-none"
            placeholder="e.g., My Mission Today"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A0B2E] mb-2">Mission Items</label>
          <div className="space-y-2 mb-3">
            {formData.items.length === 0 ? (
              <p className="text-sm text-[#1A0B2E]/50 italic">No mission items yet. Add some below.</p>
            ) : (
              formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="flex-1 rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              className="flex-1 rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-3 py-2 text-sm focus:border-[#D4AF37] outline-none"
              placeholder="Add new mission item..."
            />
            <button
              onClick={addItem}
              className="inline-flex items-center gap-1 rounded-lg border border-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0B2E] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-2 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Mission Section"}
        </button>
      </div>
    </div>
  );
}