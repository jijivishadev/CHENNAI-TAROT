export type ViewportMode = "mobile" | "tablet" | "desktop";

export type TierLayout = {
  xPos: number;
  yPos: number;
  headlineFontSize: number;
  subheadlineFontSize: number;
  textColor: string;
  textAlign: "left" | "center" | "right";
};

export type HeroConfig = {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  headlineColor: string;
  subheadlineColor: string;
  ctaTextColor: string;
  ctaBackgroundColor: string;
  mobile: TierLayout;
  tablet: TierLayout;
  desktop: TierLayout;
  updatedAt?: number;
};

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  headline: "Clear Blocks. Create Millions.",
  subheadline: "Align within. Expand your wealth. Step into multi-million dollar success with Jothi Ramesh.",
  ctaText: "BOOK DISCOVERY CALL",
  ctaLink: "/survey",
  headlineColor: "#D4AF37",
  subheadlineColor: "#F3ECFF",
  ctaTextColor: "#1A0B2E",
  ctaBackgroundColor: "#D4AF37",
  mobile: {
    xPos: 50,
    yPos: 58,
    headlineFontSize: 24,
    subheadlineFontSize: 16,
    textColor: "#FFFFFF",
    textAlign: "center",
  },
  tablet: {
    xPos: 10,
    yPos: 20,
    headlineFontSize: 42,
    subheadlineFontSize: 22,
    textColor: "#FFFFFF",
    textAlign: "left",
  },
  desktop: {
    xPos: 2,
    yPos: 24,
    headlineFontSize: 56,
    subheadlineFontSize: 26,
    textColor: "#FFFFFF",
    textAlign: "left",
  },
};

export function normalizeTierLayout(input: Partial<TierLayout> | undefined, fallback: TierLayout): TierLayout {
  const legacy = (input ?? {}) as Partial<{
    top: number;
    left: number;
    fontSize: number;
    subheadlineFontSize: number;
  }>;
  const nextHeadlineFontSize =
    typeof input?.headlineFontSize === "number"
      ? input.headlineFontSize
      : typeof legacy.fontSize === "number"
        ? legacy.fontSize
        : fallback.headlineFontSize;

  return {
    xPos: typeof input?.xPos === "number" ? input.xPos : typeof legacy.left === "number" ? legacy.left : fallback.xPos,
    yPos: typeof input?.yPos === "number" ? input.yPos : typeof legacy.top === "number" ? legacy.top : fallback.yPos,
    headlineFontSize: nextHeadlineFontSize,
    subheadlineFontSize:
      typeof input?.subheadlineFontSize === "number"
        ? input.subheadlineFontSize
        : typeof legacy.subheadlineFontSize === "number"
          ? legacy.subheadlineFontSize
          : Math.max(16, Math.round(nextHeadlineFontSize * 0.42)),
    textColor:
      typeof input?.textColor === "string" && input.textColor.trim().length > 0
        ? input.textColor.trim()
        : fallback.textColor,
    textAlign:
      input?.textAlign === "left" || input?.textAlign === "center" || input?.textAlign === "right"
        ? input.textAlign
        : fallback.textAlign,
  };
}

export function normalizeHeroConfig(input?: Partial<HeroConfig> | null): HeroConfig {
  return {
    headline: typeof input?.headline === "string" && input.headline.trim() ? input.headline.trim() : DEFAULT_HERO_CONFIG.headline,
    subheadline:
      typeof input?.subheadline === "string" && input.subheadline.trim()
        ? input.subheadline.trim()
        : DEFAULT_HERO_CONFIG.subheadline,
    ctaText: typeof input?.ctaText === "string" && input.ctaText.trim() ? input.ctaText.trim() : DEFAULT_HERO_CONFIG.ctaText,
    ctaLink: typeof input?.ctaLink === "string" && input.ctaLink.trim() ? input.ctaLink.trim() : DEFAULT_HERO_CONFIG.ctaLink,
    headlineColor:
      typeof input?.headlineColor === "string" && input.headlineColor.trim()
        ? input.headlineColor.trim()
        : DEFAULT_HERO_CONFIG.headlineColor,
    subheadlineColor:
      typeof input?.subheadlineColor === "string" && input.subheadlineColor.trim()
        ? input.subheadlineColor.trim()
        : DEFAULT_HERO_CONFIG.subheadlineColor,
    ctaTextColor:
      typeof input?.ctaTextColor === "string" && input.ctaTextColor.trim()
        ? input.ctaTextColor.trim()
        : DEFAULT_HERO_CONFIG.ctaTextColor,
    ctaBackgroundColor:
      typeof input?.ctaBackgroundColor === "string" && input.ctaBackgroundColor.trim()
        ? input.ctaBackgroundColor.trim()
        : DEFAULT_HERO_CONFIG.ctaBackgroundColor,
    mobile: normalizeTierLayout(input?.mobile, DEFAULT_HERO_CONFIG.mobile),
    tablet: normalizeTierLayout(input?.tablet, DEFAULT_HERO_CONFIG.tablet),
    desktop: normalizeTierLayout(input?.desktop, DEFAULT_HERO_CONFIG.desktop),
    updatedAt: typeof input?.updatedAt === "number" ? input.updatedAt : undefined,
  };
}
