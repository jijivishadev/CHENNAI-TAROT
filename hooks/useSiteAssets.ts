"use client";

import { useEffect, useState } from "react";
import { getSiteAssets, SiteAssets } from "@/lib/firebaseServices";

let cachedAssets: SiteAssets | null = null;
let cachedAssetsPromise: Promise<SiteAssets> | null = null;

export function useSiteAssets() {
  const [assets, setAssets] = useState<SiteAssets>(cachedAssets ?? {});
  const [loading, setLoading] = useState(!cachedAssets);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data =
          cachedAssets ??
          (cachedAssetsPromise ?? (cachedAssetsPromise = getSiteAssets().then((result) => {
            cachedAssets = result;
            cachedAssetsPromise = null;
            return result;
          })));

        const resolvedData = await data;
        setAssets(resolvedData);
      } catch (error) {
        console.error("Failed to fetch site assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return { assets, loading };
}
