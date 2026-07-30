"use client";

import { useEffect, useState } from "react";

const GOOGLE_ANALYTICS_ID = "G-ZRJZ19FC3R";
const ZOHO_SALESIQ_SRC = "https://salesiq.zohopublic.com/widget?wc=siqb3a19061089e37d692b7535f10a238c7326e863fcbd76227eb8ac78075e34e15";
const ZOHO_PAGESENSE_SRC = "https://cdn.pagesense.io/js/bzcxano3/270685c2610343aab5849e65921a3e8e.js";

function appendScript(id: string, attrs: Partial<HTMLScriptElement> & { text?: string }) {
  const existing = document.getElementById(id);
  if (existing) {
    return existing as HTMLScriptElement;
  }

  const script = document.createElement("script");
  script.id = id;

  if (attrs.src) script.src = attrs.src;
  if (attrs.async !== undefined) script.async = attrs.async;
  if (attrs.defer !== undefined) script.defer = attrs.defer;
  if (attrs.type) script.type = attrs.type;
  if (attrs.text) script.text = attrs.text;

  document.body.appendChild(script);
  return script;
}

export default function ThirdPartyScripts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const addedScripts: HTMLScriptElement[] = [];

    addedScripts.push(
      appendScript("google-analytics-src", {
        src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
        async: true,
      })
    );

    addedScripts.push(
      appendScript("google-analytics-init", {
        text: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${GOOGLE_ANALYTICS_ID}');`,
      })
    );

    addedScripts.push(
      appendScript("zoho-salesiq-init", {
        text: `window.$zoho = window.$zoho || {};\nwindow.$zoho.salesiq = window.$zoho.salesiq || { ready: function () {} };`,
      })
    );

    addedScripts.push(
      appendScript("zsiqscript", {
        src: ZOHO_SALESIQ_SRC,
        async: true,
      })
    );

    addedScripts.push(
      appendScript("zoho-pagesense", {
        src: ZOHO_PAGESENSE_SRC,
        async: true,
      })
    );

    return () => {
      for (const script of addedScripts) {
        script.remove();
      }
    };
  }, [mounted]);

  return null;
}