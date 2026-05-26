"use client";
import { useEffect, useState } from "react";
import { getAboutPageContent } from "@/lib/firebaseServices";

export function useAboutPageContent(fallback: any) {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutPageContent(fallback).then(data => {
      setContent(data);
      setLoading(false);
    });
  }, []); // Empty array is MUST here

  return { content, loading };
}