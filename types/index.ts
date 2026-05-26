// ============ FOOTER TYPES ============
export interface ContactInfo {
  mobile: string;
  email: string;
  updatedAt: number;
}

export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  order: number;
  createdAt: number;
}

export interface PromotionalEvent {
  id: string;
  bannerImageUrl: string;
  redirectLink: string;
  isActive: boolean;
  updatedAt?: number;
}

// ============ COACHING TYPES ============
export interface CoachingPlan {
  id: string;
  title: string;
  price: string;
  description: string;
  buttonLink?: string;
  features: string[];
  isDiscoveryCall: boolean;
}

export interface CoachProfile {
  id: string;
  headline: string;
  name: string;
  bio: string;
  imageStorageUrl: string;
  targetAudienceSnippet: string;
  expertise: string[];
}

export interface PathwayCard {
  id: string;
  title: string;
  mainContent: string;
  flipContent: string[];
}

export interface PathwaysContent {
  eyebrow: string;
  heading: string;
  cards: PathwayCard[];
}

// ============ ABOUT PAGE TYPES ============
export interface AboutPageContent {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  expertise: string[];
  originDescription: string;
}

export interface EarlyLifeCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export interface VideoSection {
  videoUrl: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  embedCode?: string;  
}

export interface CoreBelief {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface MissionSection {
  title: string;
  items: string[];
}

export interface RecognitionsSection {
  title: string;
  items: string[];
}

export interface ImageManagerSettings {
  heroBannerUrl?: string;
  mobileBannerUrl?: string;
  aboutSectionImageUrl?: string;
  testimonialHeaderUrl?: string;
  updatedAt?: number;
}

// ============ TESTIMONIAL TYPES ============
export interface VideoTestimonial {
  id: string;
  clientName: string;
  youtubeEmbedUrl: string;
  resultsQuote: string;
}

export interface TestimonialReview {
  id: string;
  reviewerName: string;
  designation: string;
  portraitUrl: string;
  portraitAlt: string;
  quote: string;
}