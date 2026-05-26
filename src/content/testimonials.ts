import { TestimonialReview, VideoTestimonial } from "@/types";

export const testimonialsContent: {
  pageLabel: string;
  heroTitle: string;
  heroDescription: string;
  testimonials: VideoTestimonial[];
  reviews: TestimonialReview[];
} = {
  pageLabel: "Testimonials",
  heroTitle: "Aligned Wealth in Action",
  heroDescription:
    "Real client breakthroughs showcasing how inner alignment translates into  million dollar results",
  testimonials: [
    {
      id: "testimonial-1",
      clientName: "Daniel R.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
      resultsQuote:
        "I increased revenue by 32% and stopped carrying constant provider panic into every decision.",
    },
    {
      id: "testimonial-2",
      clientName: "Jason K.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      resultsQuote:
        "The ROI was immediate. I made sharper investments, led better, and felt more peace at home.",
    },
    {
      id: "testimonial-3",
      clientName: "Andre T.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      resultsQuote:
        "I stopped operating from scarcity and started leading with conviction, which changed my income and my marriage.",
    },
    {
      id: "testimonial-4",
      clientName: "Meera S.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw?start=12",
      resultsQuote:
        "I finally built a weekly execution rhythm that protected my energy and doubled my conversion consistency.",
    },
    {
      id: "testimonial-5",
      clientName: "Karan P.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/M7lc1UVf-VE?start=35",
      resultsQuote:
        "My decision quality improved because I stopped reacting emotionally and started leading from long-term clarity.",
    },
    {
      id: "testimonial-6",
      clientName: "Ananya V.",
      youtubeEmbedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?start=48",
      resultsQuote:
        "I restored confidence with my team and replaced burnout cycles with sustainable momentum quarter after quarter.",
    },
  ],
  reviews: [
    {
      id: "review-1",
      reviewerName: "Priya Menon",
      designation: "Founder, Wellness Collective",
      portraitUrl: "/coach-photo.svg",
      portraitAlt: "Portrait of Priya Menon",
      quote:
        "Jothi helped me replace fear-led decisions with grounded strategy. Our revenue became more predictable and my leadership felt calm for the first time in years.",
    },
    {
      id: "review-2",
      reviewerName: "Arjun Sharma",
      designation: "Startup Advisor & Angel Investor",
      portraitUrl: "/male-coach-study.svg",
      portraitAlt: "Portrait of Arjun Sharma",
      quote:
        "Within twelve weeks, my focus sharpened, my energy stabilized, and I started evaluating opportunities from clarity instead of urgency.",
    },
    {
      id: "review-3",
      reviewerName: "Neha Krishnan",
      designation: "Director, Product Strategy",
      portraitUrl: "/male-coach-hero.svg",
      portraitAlt: "Portrait of Neha Krishnan",
      quote:
        "The coaching was both practical and deeply transformational. I negotiated better, slept better, and finally built momentum that lasted.",
    },
    {
      id: "review-4",
      reviewerName: "Vikram Iyer",
      designation: "Chief Financial Officer, TechScale",
      portraitUrl: "/male-coach-hero.svg",
      portraitAlt: "Portrait of Vikram Iyer",
      quote:
        "The integration of financial wisdom and spiritual alignment transformed how I lead. My team feels it, and our business metrics show it.",
    },
    {
      id: "review-5",
      reviewerName: "Sanjana Desai",
      designation: "Founder & CEO, Design Studio",
      portraitUrl: "/coach-photo.svg",
      portraitAlt: "Portrait of Sanjana Desai",
      quote:
        "I went from constantly burning out to orchestrating sustainable growth. The shift toward abundance consciousness changed everything about how I run my business.",
    },
    {
      id: "review-6",
      reviewerName: "Rohan Malhotra",
      designation: "Managing Partner, Growth Equity",
      portraitUrl: "/male-coach-study.svg",
      portraitAlt: "Portrait of Rohan Malhotra",
      quote:
        "This work helped me cut noise and lead from conviction. We improved decision speed, strengthened team trust, and hit our quarterly targets with less stress.",
    },
  ],
} as const;
