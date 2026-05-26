"use client";

import { useEffect, useState } from "react";
import { getCoachingPlans, updateCoachingPlan, initializeOffersIfEmpty } from "@/lib/firebaseServices";
import { CoachingPlan } from "@/types";
import { Playfair_Display } from "next/font/google";
import { Save, AlertCircle } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

export default function OffersPage() {
  const [plans, setPlans] = useState<CoachingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<CoachingPlan>({
    id: "",
    title: "",
    price: "",
    description: "",
    buttonLink: "",
    features: [],
    isDiscoveryCall: false,
  });

  const EXPECTED_PLAN_IDS = ["plan-discovery", "plan-3-month", "plan-1-year"] as const;

  useEffect(() => {
    const loadPlans = async () => {
      try {
        await initializeOffersIfEmpty();
        const data = await getCoachingPlans();
        console.log("Loaded plans in admin:", data);
        setPlans(data.length > 0 ? normalizePlans(data) : getDefaultPlans());
        setLoading(false);
      } catch (error) {
        console.error("Error loading plans:", error);
        setPlans(getDefaultPlans());
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const getDefaultPlans = (): CoachingPlan[] => [
    {
      id: "plan-discovery",
      title: "Discovery Call",
      price: "$111",
      description: "A decisive first-step conversation to uncover where provider pressure, ego, and scarcity are distorting your financial leadership.",
      features: [
        "60-minute strategic diagnosis",
        "Clear wealth bottleneck assessment",
        "Precision next-step recommendation",
      ],
      buttonLink: "https://calendly.com/",
      isDiscoveryCall: true,
    },
    {
      id: "plan-3-month",
      title: "3-Month Container",
      price: "$2,997",
      description: "A focused container to recalibrate your identity, eliminate scarcity patterns, and create grounded financial momentum.",
      features: [
        "Bi-weekly private coaching",
        "Provider-stress recalibration tools",
        "Execution support for real revenue growth",
      ],
      buttonLink: "https://calendly.com/",
      isDiscoveryCall: false,
    },
    {
      id: "plan-1-year",
      title: "1-Year Mastermind",
      price: "$11,111",
      description: "A long-range leadership container for men committed to mastering wealth, purpose, and peace without internal fragmentation.",
      features: [
        "Monthly authority intensives",
        "Quarterly strategy recalibration",
        "Private mentorship for major money decisions",
      ],
      buttonLink: "https://calendly.com/",
      isDiscoveryCall: false,
    },
  ];

  const normalizePlans = (incomingPlans: CoachingPlan[]): CoachingPlan[] => {
    const incomingById = new Map(incomingPlans.map((plan) => [plan.id, plan]));
    const fallbackById = new Map(getDefaultPlans().map((plan) => [plan.id, plan]));

    return EXPECTED_PLAN_IDS.map((id) => incomingById.get(id) || fallbackById.get(id)).filter(
      (plan): plan is CoachingPlan => Boolean(plan)
    );
  };

  const handleEditPlan = (index: number) => {
    setFormData(plans[index]);
    setEditingIndex(index);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData({
      id: "",
      title: "",
      price: "",
      description: "",
      buttonLink: "",
      features: [],
      isDiscoveryCall: false,
    });
  };

  const handleInputChange = (field: keyof CoachingPlan, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSavePlan = async () => {
    if (!formData.title.trim() || !formData.price.trim() || !formData.description.trim()) {
      setMessage("All fields are required.");
      return;
    }

    if (formData.features.some((f) => !f.trim())) {
      setMessage("All features must be filled in.");
      return;
    }

    setSaving(true);
    setMessage("");

    const normalizedIsDiscoveryCall = formData.id === "plan-discovery";

    try {
      console.log("Saving plan with data:", formData);
      await updateCoachingPlan(formData.id, {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        buttonLink: formData.buttonLink?.trim() || "",
        features: formData.features,
        isDiscoveryCall: normalizedIsDiscoveryCall,
      });

      const updatedPlan: CoachingPlan = {
        ...formData,
        buttonLink: formData.buttonLink?.trim() || "",
        isDiscoveryCall: normalizedIsDiscoveryCall,
      };

      setPlans((prev) =>
        prev.map((p, i) => (i === editingIndex ? updatedPlan : p))
      );

      console.log("Plan saved successfully!");
      setMessage("Plan updated successfully!");
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving plan:", error);
      setMessage("Failed to save plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#F3ECFF] via-[#F8F9FA] to-[#e6e0f7] p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[#4B2E83]">Loading coaching plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F3ECFF] via-[#F8F9FA] to-[#e6e0f7] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#4B2E83] mb-2`}>
          Manage Offers
        </h1>
        <p className="text-[#333333] mb-10">Edit coaching plan details, prices, and features.</p>

        <div className="grid gap-8">
          {plans.map((plan, idx) => (
            <div key={plan.id} className="rounded-2xl border border-[#D4AF37]/25 bg-white/90 p-8 shadow-lg">
              {editingIndex === idx ? (
                // Edit Form
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  handleSavePlan();
                }}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Plan Title</span>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Price</span>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                        placeholder="$111"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Button Redirect Link</span>
                      <input
                        type="url"
                        value={formData.buttonLink || ""}
                        onChange={(e) => handleInputChange("buttonLink", e.target.value)}
                        className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                        placeholder="https://calendly.com/your-link"
                      />
                      <p className="mt-2 text-xs text-[#4B2E83]/70">
                        Accepts Calendly, WhatsApp, or internal routes. It opens in a new tab on the live site.
                      </p>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#4B2E83]">Description</span>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-3 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                    />
                  </label>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#4B2E83]">Features/Highlights</span>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="text-xs font-bold text-[#D4AF37] hover:text-[#4B2E83]"
                      >
                        + ADD FEATURE
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(fIdx, e.target.value)}
                            className="flex-1 rounded-xl border border-[#4B2E83]/20 bg-[#FDFBFF] px-4 py-2 text-sm text-[#1A0B2E] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(fIdx)}
                            className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#4B2E83] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#3D2468] disabled:opacity-60"
                    >
                      <Save size={16} /> {saving ? "Saving..." : "Save Plan"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 text-sm font-semibold text-[#4B2E83] hover:bg-[#F3ECFF] rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>

                  {message && (
                    <div className={`flex gap-2 rounded-lg p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      <AlertCircle size={16} />
                      {message}
                    </div>
                  )}

                  <div className="rounded-xl border border-[#D4AF37]/25 bg-[#FDFBFF] p-4 text-sm text-[#333333]">
                    <div className="font-semibold text-[#4B2E83]">Button Link Preview</div>
                    <div className="mt-1 break-all text-[#333333]">{formData.buttonLink?.trim() || "No redirect link set yet."}</div>
                    <div className="mt-2 text-xs text-[#4B2E83]/70">
                      Status: {formData.buttonLink?.trim() ? "Saved URL will open in a new tab on the live site." : "Add a URL to enable button navigation."}
                    </div>
                  </div>
                </form>
              ) : (
                // Display View
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`${playfair.className} text-2xl text-[#D4AF37]`}>{plan.title}</h3>
                      <p className="mt-2 text-3xl font-bold text-[#333333]">{plan.price}</p>
                    </div>                  </div>

                  <p className="text-sm leading-6 text-[#333333]">{plan.description}</p>

                  <div className="rounded-lg border border-[#D4AF37]/25 bg-[#FDFBFF] p-3 text-xs text-[#4B2E83]">
                    <span className="font-semibold">Button Link:</span>{" "}
                    <span className="break-all">{plan.buttonLink || "Not set"}</span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-[#333333]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleEditPlan(idx)}
                    className="mt-6 rounded-lg border border-[#4B2E83] bg-[#4B2E83] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#3D2468]"
                  >
                    Edit Plan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
