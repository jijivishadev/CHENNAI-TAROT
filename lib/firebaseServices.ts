// lib/firebaseServices.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  getDocFromServer,
  setDoc,
  query,
  orderBy,
  writeBatch,
  deleteField
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type {
  AboutPageContent,
  EarlyLifeCard,
  VideoSection,
  CoreBelief,
  MissionSection,
  RecognitionsSection,
  ContactInfo,
  SocialPlatform,
  PromotionalEvent,
  CoachingPlan,
  PathwaysContent,
  ImageManagerSettings
} from "@/types";

// ============ CACHE CONFIGURATION ============
const CACHE_TTL = 5 * 60 * 1000;

// Site Assets Cache
let cachedSiteAssets: SiteAssets | null = null;
let cachedSiteAssetsTime: number = 0;

// About Page Content Cache

// Pathways Content Cache
let cachedPathwaysContent: PathwaysContent | null = null;
let cachedPathwaysContentTime: number = 0;

// ============ DOCUMENT REFERENCES ============
const SITE_ASSETS_REF = doc(db, "settings", "site_assets");
const ANNOUNCEMENT_BAR_REF = doc(db, "settings", "announcement_bar");
const HOME_MESSAGE_REF = doc(db, "pages", "home_message");
const PATHWAYS_REF = doc(db, "pages", "pathways");
const OFFERS_COLLECTION = "offers";
const ABOUT_PAGE_REF = doc(db, "pages", "about");
const VIDEO_SECTION_REF = doc(db, "pages", "about_video");
const MISSION_REF = doc(db, "pages", "about_mission");
const RECOGNITIONS_REF = doc(db, "pages", "about_recognitions");
const IMAGE_MANAGER_REF = doc(db, "settings", "imageManager");
const PROMOTIONAL_EVENT_REF = doc(db, "events", "promotional_event");

// ============ COLLECTION REFERENCES ============
const EARLY_LIFE_COLLECTION = "about_early_life";
const CORE_BELIEFS_COLLECTION = "about_core_beliefs";

// ============ SITE ASSETS (Existing) ============
export interface SiteAssets {
  discoveryImageUrl?: string;
  originImageUrl1?: string;
  originImageUrl2?: string;
  aboutSectionImageUrl?: string;
}

export interface ImageManagerDocument extends ImageManagerSettings { }

export interface AnnouncementBarContent {
  text: string;
  isEnabled: boolean;
  updatedAt?: number;
}

export interface HomeMessageContent {
  title: string;
  paragraphs: string[];
  updatedAt?: number;
}

const DEFAULT_ANNOUNCEMENT_TEXT = "Transform Your Wealth: New 1-Year Abundance Container Open Now";
const DEFAULT_HOME_MESSAGE: HomeMessageContent = {
  title: "A Message From The Coach",
  paragraphs: [
    "Most men are never taught how to hold money without tension. They are taught to produce, to perform, and to protect, but not to process the provider stress that comes with carrying everything alone.",
    "The result is predictable: ego-driven decisions, hidden scarcity, compulsive pressure, and a nervous system that treats success like a threat. You can make more and still feel less safe.",
    "This work is about mastering both strategy and spirit so your money expands without costing your peace of mind. When your inner architecture is aligned, your external wealth starts to behave differently.",
  ],
};

const DEFAULT_PATHWAYS_CONTENT: PathwaysContent = {
  eyebrow: "The Transformation",
  heading: "Pathways to Abundance",
  cards: [
    {
      id: "abundance-container",
      title: "The Abundance Container",
      mainContent: "A high-level, 12-month immersion for total spiritual and financial recalibration.",
      flipContent: [
        "Monthly private strategy intensives",
        "Personalized wealth and mindset roadmap",
        "Ongoing support and accountability check-ins",
      ],
    },
    {
      id: "wealth-alignment-intensive",
      title: "Wealth Alignment Intensive",
      mainContent: "Break through energetic blocks and master your money mindset in 90 days.",
      flipContent: [
        "Weekly alignment and execution sessions",
        "Custom habit reset for money confidence",
        "Clear 90-day growth milestones",
      ],
    },
    {
      id: "wealth-survey",
      title: "The Wealth Survey",
      mainContent: "Uncover your hidden money patterns with our signature diagnostic tool.",
      flipContent: [
        "Comprehensive abundance pattern score",
        "Personalized insight summary",
        "Action plan for immediate next steps",
      ],
    },
  ],
};

export async function getCoachingPlans(): Promise<CoachingPlan[]> {
  try {
    const response = await fetch("/api/offers", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Offers API failed with status ${response.status}`);
    }

    const data = (await response.json()) as { plans?: CoachingPlan[]; source?: string };
    if (data.source === "fallback") {
      throw new Error("Offers API returned fallback payload; switching to client Firestore query");
    }

    return Array.isArray(data.plans) ? data.plans : [];
  } catch (error) {
    console.warn("Offers API fetch failed, falling back to Firestore client query:", error);
    try {
      const snapshot = await getDocs(collection(db, OFFERS_COLLECTION));
      console.log(`Fetched ${snapshot.docs.length} plans without orderBy`);
      const plans = snapshot.docs.map((doc) => {
        console.log("Plan doc:", { id: doc.id, ...doc.data() });
        return { id: doc.id, ...doc.data() } as CoachingPlan;
      });
      return plans;
    } catch (fallbackError) {
      console.error("Both queries failed:", fallbackError);
      return [];
    }
  }
}

export async function updateCoachingPlan(id: string, data: Partial<Omit<CoachingPlan, "id">>) {
  try {
    const response = await fetch("/api/offers", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      throw new Error(`Offers API update failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn("Offers API update failed, falling back to Firestore client write:", error);
    await setDoc(doc(db, OFFERS_COLLECTION, id), { ...data, updatedAt: Date.now() }, { merge: true });
  }
}

export async function addCoachingPlan(plan: Omit<CoachingPlan, "id">) {
  return await addDoc(collection(db, OFFERS_COLLECTION), { ...plan, updatedAt: Date.now() });
}

export async function initializeOffersIfEmpty() {
  // The API GET seeds defaults server-side if the collection is empty.
  await getCoachingPlans();
}

export async function getAnnouncementBarContent(): Promise<AnnouncementBarContent> {
  const snapshot = await getDoc(ANNOUNCEMENT_BAR_REF);
  if (!snapshot.exists()) {
    return {
      text: DEFAULT_ANNOUNCEMENT_TEXT,
      isEnabled: true,
    };
  }

  const data = snapshot.data();
  return {
    text:
      typeof data.text === "string" && data.text.trim().length > 0
        ? data.text.trim()
        : DEFAULT_ANNOUNCEMENT_TEXT,
    isEnabled: typeof data.isEnabled === "boolean" ? data.isEnabled : true,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
  };
}

export async function updateAnnouncementBarContent(content: Partial<AnnouncementBarContent>) {
  await setDoc(
    ANNOUNCEMENT_BAR_REF,
    {
      ...content,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function getHomeMessageContent(): Promise<HomeMessageContent> {
  const snapshot = await getDoc(HOME_MESSAGE_REF);
  if (!snapshot.exists()) {
    return DEFAULT_HOME_MESSAGE;
  }

  const data = snapshot.data();
  const paragraphs = Array.isArray(data.paragraphs)
    ? data.paragraphs.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  return {
    title: typeof data.title === "string" && data.title.trim().length > 0 ? data.title.trim() : DEFAULT_HOME_MESSAGE.title,
    paragraphs: paragraphs.length > 0 ? paragraphs : DEFAULT_HOME_MESSAGE.paragraphs,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
  };
}

export async function updateHomeMessageContent(content: Partial<HomeMessageContent>) {
  await setDoc(
    HOME_MESSAGE_REF,
    {
      ...content,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function getPromotionalEvent(): Promise<PromotionalEvent | null> {
  const snapshot = await getDoc(PROMOTIONAL_EVENT_REF);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    bannerImageUrl: typeof data.bannerImageUrl === "string" ? data.bannerImageUrl.trim() : "",
    redirectLink: typeof data.redirectLink === "string" ? data.redirectLink.trim() : "",
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
  };
}

export async function updatePromotionalEvent(content: Partial<Omit<PromotionalEvent, "id">>) {
  await setDoc(
    PROMOTIONAL_EVENT_REF,
    {
      ...content,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function getSiteAssets(): Promise<SiteAssets> {
  const snapshot = await getDoc(SITE_ASSETS_REF);
  if (!snapshot.exists()) {
    return {};
  }
  return snapshot.data() as SiteAssets;
}

export async function saveSiteAssetUrl(field: string, url: string) {
  await setDoc(
    SITE_ASSETS_REF,
    {
      [field]: url,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function deleteSiteAssetUrl(field: string) {
  await setDoc(
    SITE_ASSETS_REF,
    {
      [field]: deleteField(),
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export function normalizeImageManagerSettings(input?: Partial<ImageManagerSettings> | null): ImageManagerSettings {
  return {
    heroBannerUrl:
      typeof input?.heroBannerUrl === "string" && input.heroBannerUrl.trim().length > 0
        ? input.heroBannerUrl.trim()
        : undefined,
    mobileBannerUrl:
      typeof input?.mobileBannerUrl === "string" && input.mobileBannerUrl.trim().length > 0
        ? input.mobileBannerUrl.trim()
        : undefined,
    testimonialHeaderUrl:
      typeof input?.testimonialHeaderUrl === "string" && input.testimonialHeaderUrl.trim().length > 0
        ? input.testimonialHeaderUrl.trim()
        : undefined,
    updatedAt: typeof input?.updatedAt === "number" ? input.updatedAt : undefined,
  };
}

export async function getImageManagerSettings(): Promise<ImageManagerSettings> {
  const snapshot = await getDoc(IMAGE_MANAGER_REF);
  if (!snapshot.exists()) {
    return {};
  }

  return normalizeImageManagerSettings(snapshot.data() as Partial<ImageManagerSettings>);
}

export async function updateImageManagerSettings(content: Partial<ImageManagerSettings>) {
  await setDoc(
    IMAGE_MANAGER_REF,
    {
      ...content,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function uploadStorageFile(storagePath: string, file: File, onProgress?: (value: number) => void) {
  const fullStoragePath = `${storagePath}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fullStoragePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return await new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

type UploadSiteAssetParams = {
  field: string;
  storagePath: string;
  file: File;
  onProgress?: (value: number) => void;
};

export async function uploadSiteAssetFile({ field, storagePath, file, onProgress }: UploadSiteAssetParams) {
  const downloadUrl = await uploadStorageFile(storagePath, file, onProgress);

  await saveSiteAssetUrl(field, downloadUrl);
  return downloadUrl;
}



// ============ ABOUT PAGE BASIC INFO (Existing) ============
export async function getAboutPageContent(fallback: AboutPageContent): Promise<AboutPageContent> {
  try {
    // Force fresh fetch from pages/about
    const aboutSnapshot = await getDocFromServer(doc(db, "pages", "about"));
    
    if (!aboutSnapshot.exists()) return fallback;
    
    const data = aboutSnapshot.data() as Record<string, unknown>;

    const pickString = (...values: unknown[]): string | undefined => {
      for (const value of values) {
        if (typeof value === "string" && value.trim().length > 0) {
          return value.trim();
        }
      }
      return undefined;
    };

    const originDescription = pickString(
      data.originDescription,
      data.origin_description,
      data.originText,
      data.origin_text,
      data.homeOriginDescription,
      data.home_origin_description
    );

    const description = pickString(data.description);
    const title = pickString(data.title);
    const subtitle = pickString(data.subtitle);
    const imageUrl = pickString(data.imageUrl);

    const expertiseRaw =
      Array.isArray(data.expertise)
        ? data.expertise
        : Array.isArray(data.expertiseTags)
          ? data.expertiseTags
          : undefined;

    const expertise =
      expertiseRaw?.filter((item): item is string => typeof item === "string" && item.trim().length > 0) ||
      fallback.expertise;

    return {
      title: title || fallback.title,
      subtitle: subtitle || fallback.subtitle,
      description: description || fallback.description,
      imageUrl: imageUrl || fallback.imageUrl,
      expertise,
      // Keep origin independent from generic description to avoid showing wrong copy.
      originDescription: originDescription || fallback.originDescription
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return fallback;
  }
}

export async function updateAboutPageContent(content: Partial<AboutPageContent>) {
  await setDoc(ABOUT_PAGE_REF, { ...content, updatedAt: Date.now() }, { merge: true });
}

// ============ EARLY LIFE CARDS (NEW) ============
export async function getEarlyLifeCards(): Promise<EarlyLifeCard[]> {
  const q = query(collection(db, EARLY_LIFE_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EarlyLifeCard));
}

export async function addEarlyLifeCard(card: Omit<EarlyLifeCard, "id">) {
  return await addDoc(collection(db, EARLY_LIFE_COLLECTION), card);
}

export async function updateEarlyLifeCard(id: string, data: Partial<Omit<EarlyLifeCard, "id" | "order">>) {
  await updateDoc(doc(db, EARLY_LIFE_COLLECTION, id), data);
}

export async function deleteEarlyLifeCard(id: string) {
  await deleteDoc(doc(db, EARLY_LIFE_COLLECTION, id));
}

export async function reorderEarlyLifeCards(updates: { id: string; order: number }[]) {
  const batch = writeBatch(db);
  updates.forEach(({ id, order }) => {
    batch.update(doc(db, EARLY_LIFE_COLLECTION, id), { order });
  });
  await batch.commit();
}

// ============ CORE BELIEFS (NEW) ============
export async function getCoreBeliefs(): Promise<CoreBelief[]> {
  const q = query(collection(db, CORE_BELIEFS_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CoreBelief));
}

export async function addCoreBelief(belief: Omit<CoreBelief, "id">) {
  return await addDoc(collection(db, CORE_BELIEFS_COLLECTION), belief);
}

export async function updateCoreBelief(id: string, data: Partial<Omit<CoreBelief, "id" | "order">>) {
  await updateDoc(doc(db, CORE_BELIEFS_COLLECTION, id), data);
}

export async function deleteCoreBelief(id: string) {
  await deleteDoc(doc(db, CORE_BELIEFS_COLLECTION, id));
}

export async function getVideoSection(): Promise<VideoSection> {
  const snapshot = await getDoc(VIDEO_SECTION_REF);
  if (!snapshot.exists()) {
    return {
      videoUrl: "https://player.vimeo.com/video/1102105273",
      title: "Global Legacy",
      description: "A visual testament to transformations that transcend borders.",
      thumbnailUrl: "",
      embedCode: "",
    };
  }

  const data = snapshot.data() as Partial<VideoSection>;
  return {
    videoUrl: typeof data.videoUrl === "string" ? data.videoUrl : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    thumbnailUrl: typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : "",
    embedCode: typeof data.embedCode === "string" ? data.embedCode : "",
  };
}

export async function updateVideoSection(data: Partial<VideoSection>) {
  await setDoc(VIDEO_SECTION_REF, { ...data, updatedAt: Date.now() }, { merge: true });
}

// ============ MISSION SECTION (NEW) ============
export async function getMissionSection(): Promise<MissionSection> {
  const snapshot = await getDoc(MISSION_REF);
  if (!snapshot.exists()) {
    return {
      title: "My Mission Today",
      items: [
        "Unlock abundance & financial freedom",
        "Overcome limiting beliefs",
        "Heal through intuitive methods",
        "Harness personal energy"
      ],
    };
  }
  return snapshot.data() as MissionSection;
}

export async function updateMissionSection(data: Partial<MissionSection>) {
  await setDoc(MISSION_REF, { ...data, updatedAt: Date.now() }, { merge: true });
}

// ============ RECOGNITIONS SECTION (NEW) ============
export async function getRecognitionsSection(): Promise<RecognitionsSection> {
  const snapshot = await getDoc(RECOGNITIONS_REF);
  if (!snapshot.exists()) {
    return {
      title: "Recognitions",
      items: [
        "25+ million INR raised for social causes",
        "Life Changer Award for coaching",
        "Distinguished Alumni Award from VIT"
      ],
    };
  }
  return snapshot.data() as RecognitionsSection;
}

export async function updateRecognitionsSection(data: Partial<RecognitionsSection>) {
  await setDoc(RECOGNITIONS_REF, { ...data, updatedAt: Date.now() }, { merge: true });
}

// ============ FOOTER SERVICES (Existing) ============
export async function getFooterContactInfo(): Promise<ContactInfo | null> {
  const settingsDoc = await getDoc(doc(db, "settings", "contact_info"));
  if (settingsDoc.exists()) {
    return settingsDoc.data() as ContactInfo;
  }

  const collectionSnap = await getDocs(collection(db, "contact_info"));
  if (collectionSnap.empty) return null;

  const latestDoc = collectionSnap.docs
    .map((item) => item.data() as ContactInfo)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];

  return latestDoc || null;
}

export async function getFooterSocialPlatforms(): Promise<SocialPlatform[]> {
  const snap = await getDoc(doc(db, "settings", "footer_socials"));
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.platforms) ? data.platforms : [];
}

export async function getPathwaysContent(): Promise<PathwaysContent> {
  const snapshot = await getDoc(PATHWAYS_REF);
  if (!snapshot.exists()) {
    return { ...DEFAULT_PATHWAYS_CONTENT };
  }

  const data = snapshot.data();
  const cards = Array.isArray(data.cards)
    ? data.cards
      .filter((card) => card && typeof card === "object")
      .map((card, index) => {
        const typedCard = card as {
          id?: string;
          title?: string;
          mainContent?: string;
          flipContent?: unknown;
        };

        const flipContent = Array.isArray(typedCard.flipContent)
          ? typedCard.flipContent.filter((line): line is string => typeof line === "string" && line.trim().length > 0)
          : [];

        return {
          id: typeof typedCard.id === "string" && typedCard.id.trim() ? typedCard.id.trim() : `pathway-card-${index + 1}`,
          title: typeof typedCard.title === "string" ? typedCard.title.trim() : "",
          mainContent: typeof typedCard.mainContent === "string" ? typedCard.mainContent.trim() : "",
          flipContent,
        };
      })
    : [];

  return {
    eyebrow:
      typeof data.eyebrow === "string" && data.eyebrow.trim().length > 0
        ? data.eyebrow.trim()
        : DEFAULT_PATHWAYS_CONTENT.eyebrow,
    heading:
      typeof data.heading === "string" && data.heading.trim().length > 0
        ? data.heading.trim()
        : DEFAULT_PATHWAYS_CONTENT.heading,
    cards: cards.length > 0 ? cards : DEFAULT_PATHWAYS_CONTENT.cards,
  };
}

export async function updatePathwaysContent(content: PathwaysContent) {
  await setDoc(
    PATHWAYS_REF,
    {
      eyebrow: content.eyebrow,
      heading: content.heading,
      cards: content.cards,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

// ============ FAQ SERVICES (NEW) ============
const FAQS_COLLECTION = "faqs";

export interface FAQRecord {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export type CreateFAQInput = {
  question: string;
  answer: string;
  order: number;
};

export type UpdateFAQInput = {
  question?: string;
  answer?: string;
  order?: number;
};

export type GetFaqsOptions = {
  fallbackToLocal?: boolean;
};

// Import local FAQ content
import { faqsContent } from "@/src/content/faqs";

export function getLocalFaqs(): FAQRecord[] {
  return faqsContent.items.map((item, index) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    order: index,
    createdAt: 0,
    updatedAt: 0,
  }));
}

export async function getFaqs(options: GetFaqsOptions = {}): Promise<FAQRecord[]> {
  const { fallbackToLocal = true } = options;
  try {
    const q = query(collection(db, FAQS_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      if (fallbackToLocal) {
        console.log("[getFaqs] Firestore FAQs collection is empty, using local fallback");
        return getLocalFaqs();
      }

      console.log("[getFaqs] Firestore FAQs collection is empty");
      return [];
    }

    const faqs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        question: typeof data.question === "string" ? data.question : "",
        answer: typeof data.answer === "string" ? data.answer : "",
        order: typeof data.order === "number" ? data.order : 0,
        createdAt: toUnixMs(data.createdAt, Date.now()),
        updatedAt: toUnixMs(data.updatedAt, Date.now()),
      } as FAQRecord;
    });

    console.log(`[getFaqs] Fetched ${faqs.length} FAQs from Firestore`);
    return faqs;
  } catch (error) {
    if (fallbackToLocal) {
      console.warn("[getFaqs] Error fetching FAQs from Firestore, falling back to local:", error);
      return getLocalFaqs();
    }

    console.error("[getFaqs] Error fetching FAQs from Firestore:", error);
    throw error;
  }
}

export async function createFaq(input: CreateFAQInput): Promise<string> {
  const timestamp = Date.now();
  const safeOrder = Number.isFinite(input.order) ? Math.max(0, Math.trunc(input.order)) : 0;

  const docRef = await addDoc(collection(db, FAQS_COLLECTION), {
    question: input.question.trim(),
    answer: input.answer.trim(),
    order: safeOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  console.log(`[createFaq] Created FAQ with ID: ${docRef.id}`);
  return docRef.id;
}

export async function updateFaq(id: string, input: UpdateFAQInput): Promise<void> {
  const faqRef = doc(db, FAQS_COLLECTION, id);
  const existingFaq = await getDoc(faqRef);
  if (!existingFaq.exists()) {
    throw new Error(`[updateFaq] FAQ not found for id: ${id}`);
  }

  const updateData: Record<string, unknown> = {
    updatedAt: Date.now(),
  };

  if (input.question !== undefined) {
    updateData.question = input.question.trim();
  }
  if (input.answer !== undefined) {
    updateData.answer = input.answer.trim();
  }
  if (input.order !== undefined) {
    updateData.order = Number.isFinite(input.order) ? Math.max(0, Math.trunc(input.order)) : 0;
  }

  await updateDoc(faqRef, updateData);
  console.log(`[updateFaq] Updated FAQ with ID: ${id}`);
}

export async function deleteFaq(id: string): Promise<void> {
  await deleteDoc(doc(db, FAQS_COLLECTION, id));
  console.log(`[deleteFaq] Deleted FAQ with ID: ${id}`);
}