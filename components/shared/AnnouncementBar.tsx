// components/shared/AnnouncementBar.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const fallbackText = "Transform Your Wealth: New 1-Year Abundance Container Open Now";

export default function AnnouncementBar() {
  const [text, setText] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const announcementRef = doc(db, "settings", "announcement_bar");
    const unsubscribe = onSnapshot(
      announcementRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setText(fallbackText);
          setIsEnabled(true);
          return;
        }

        const data = snapshot.data();
        setText(typeof data.text === "string" && data.text.trim() ? data.text.trim() : fallbackText);
        setIsEnabled(typeof data.isEnabled === "boolean" ? data.isEnabled : true);
      },
      () => {
        setText(fallbackText);
        setIsEnabled(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Don't render anything until we have data from Firebase
  if (text === null) {
    return null;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-[#4B2E83]/90 backdrop-blur-md shadow-sm"
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap whitespace-normal text-center">
          <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">$</span>
          <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium drop-shadow-sm break-words max-w-[90%] sm:max-w-full">
            {text}
          </span>
          <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">$</span>
        </div>
      </div>
    </div>
  );
}