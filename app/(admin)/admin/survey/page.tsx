"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, FileText } from "lucide-react";

export default function SurveyAdminPage() {
  const [embedCode, setEmbedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveySettings();
  }, []);

  const fetchSurveySettings = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "settings", "survey");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmbedCode(data.embedCode || "");
      }
    } catch (error) {
      console.error("Error fetching survey settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const docRef = doc(db, "settings", "survey");
      await setDoc(docRef, {
        embedCode: embedCode,
        updatedAt: Date.now(),
      });
      setMessage("Survey settings saved successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving survey settings:", error);
      setMessage("Failed to save survey settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F8F9FA] p-6 md:p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A0B2E] flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#D4AF37]" />
            Survey Manager
          </h1>
          <p className="mt-2 text-[#1A0B2E]/70">
            Manage the survey embed code for the public survey page.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A0B2E] mb-2">
                Survey Embed Code
              </label>
              <textarea
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-[#1A0B2E]/20 bg-[#F8F9FA] px-4 py-3 text-sm font-mono text-[#1A0B2E] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/35"
                placeholder='<iframe src="https://survey.zohopublic.com/zs/1HBR9j" frameborder="0" style="height:700px;width:100%;"></iframe>'
              />
              <p className="mt-2 text-xs text-[#1A0B2E]/50">
                Paste the full embed code from Zoho Survey or any other survey platform.
              </p>
            </div>

            {message && (
              <div className={`rounded-lg p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-[#1A0B2E] hover:bg-[#c59d23] transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Survey Settings"}
            </button>
          </div>

          {/* Preview Section */}
          <div className="mt-8 pt-6 border-t border-[#1A0B2E]/10">
            <h3 className="text-sm font-semibold text-[#1A0B2E] mb-3">Preview</h3>
            <div className="rounded-lg border border-[#1A0B2E]/10 bg-[#F8F9FA] p-4 overflow-auto max-h-[400px]">
              {embedCode ? (
                <div dangerouslySetInnerHTML={{ __html: embedCode }} />
              ) : (
                <p className="text-sm text-[#1A0B2E]/50 text-center py-8">No embed code added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}