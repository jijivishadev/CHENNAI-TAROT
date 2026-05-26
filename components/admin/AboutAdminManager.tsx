

import { useState } from "react";
import BasicInfoTab from "./about/BasicInfoTab";

const TABS = [
  { label: "Basic Info", component: BasicInfoTab },
];

export default function AboutAdminManager() {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#FDFBFF] p-0 sm:p-8">
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex gap-2 mb-8">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              className={`px-4 py-2 rounded-none font-semibold text-base transition border-2 ${tab === i ? "bg-[#D4AF37] text-white border-[#D4AF37]" : "bg-white text-[#4B2E83] border-[#4B2E83]/20"}`}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div>
          {TABS[tab].component && (TABS[tab].component())}
        </div>
      </div>
    </div>
  );
}
