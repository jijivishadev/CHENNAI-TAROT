"use client";
import { useEffect, useState } from "react";
import { getAboutPageContent } from "@/lib/firebaseServices";

export function useAboutPageContent(fallback: any) {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAboutPageContent(fallback)
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(fallback);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // Empty array is MUST here

  return { content, loading };
}