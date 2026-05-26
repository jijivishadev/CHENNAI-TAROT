"use client";

import { Image as ImageIcon } from "lucide-react";
import AssetUploader from "./AssetUploader";

const assetConfigs = [
  {
    title: "Hero Banner Image",
    description: "Desktop and tablet hero banner image. Recommended size: 1600x900px.",
    firestoreField: "heroBannerUrl" as const,
    storagePath: "site-assets/hero-banner",
  },
  {
    title: "Mobile Banner Image",
    description: "Mobile hero banner image. Recommended size: 900x1200px.",
    firestoreField: "mobileBannerUrl" as const,
    storagePath: "site-assets/mobile-banner",
  },
  {
    title: "Discovery Call Image",
    description: "Image for the Discovery Call section. Recommended size: 1024x768px.",
    firestoreField: "discoveryImageUrl" as const,
    storagePath: "site-assets/discovery-call",
  },
  {
    title: "Origin Section Image 1",
    description: "First image in the Home page Origin section. Recommended: 600x800 portrait (3:4).",
    firestoreField: "originImageUrl1" as const,
    storagePath: "site-assets/origin-section",
  },
  {
    title: "About Page Hero Image",
    description: "Main portrait shown in the About page hero section. Recommended: 900x1200 portrait (3:4).",
    firestoreField: "aboutSectionImageUrl" as const,
    storagePath: "site-assets/about-section",
  },
];

export default function ImageManager() {
  return (
    <div className="w-full px-4 pb-10 pt-8 lg:px-8">
      <div className="mb-10 rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_40px_rgba(20,20,30,0.06)]">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#1A0B2E] sm:text-4xl">
          <ImageIcon className="h-8 w-8 text-[#D4AF37]" />
          Super Image Manager
        </h1>
        <p className="mt-2 text-[#1A0B2E]/70">
          Manage Discovery and Origin assets from one place with instant Firestore sync.
        </p>
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-[#1A0B2E]/10 bg-white p-6 shadow-[0_10px_35px_rgba(20,20,30,0.06)]">
          <h2 className="mb-4 text-2xl font-bold text-[#1A0B2E]">Background Images</h2>
          <p className="mb-6 text-sm text-[#1A0B2E]/70">
            Hero banner images are managed here and used automatically by the Hero Editor and live homepage.
          </p>
          <div className="flex flex-col gap-6">
            {assetConfigs.map((config) => (
              <AssetUploader
                key={config.firestoreField}
                title={config.title}
                description={config.description}
                firestoreField={config.firestoreField}
                storagePath={config.storagePath}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
