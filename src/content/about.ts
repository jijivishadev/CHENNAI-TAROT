// Ensures all required fields are present in the config object, including originDescription
export function normalizeAboutConfig(config: any): typeof aboutContent {
  return {
    ...aboutContent,
    ...config,
    originDescription: typeof config.originDescription === 'string' ? config.originDescription : aboutContent.originDescription,
  };
}
export const aboutContent = {
  bioTeaserHeading: "The Origin",
  bioTeaserCtaLabel: "Know More",
  bioTeaserCtaLink: "/about",
  areasOfExpertiseLabel: "Areas of Expertise",
  secondaryImageAlt: "Jothi Ramesh in session",
  secondaryImageUrl: "/male-coach-hero.svg",
  architecturalNarrative: {
    pageLabel: "About",
    heroHeadline: "Software Engineer turned Spiritual Seeker",
    heroSubheadline:
      "Jothi Ramesh stands at the intersection of professional precision and spiritual abundance, guiding people into aligned success.",
    heroPortraitUrl: "/coach-photo.svg",
    heroPortraitAlt: "Portrait of coach Jothi Ramesh",
    milestoneLabel: "The Milestone Circuit",
    milestones: [
      {
        phase: "Phase 1 (Logic)"
    ,
        title: "Engineering Excellence",
        description:
          "Built a 21+ year software engineering career across HCL, Samsung, and Axcelis, where she received the AAA Star Award.",
      },
      {
        phase: "Phase 2 (The Pivot)",
        title: "The Sacred Transition",
        description:
          "A life-changing Mount Kailash pilgrimage opened a new direction, leading to her mission of empowering 25 million lives.",
      },
      {
        phase: "Phase 3 (Mastery)",
        title: "Integrated Spiritual Training",
        description:
          "Deepened mastery through studies in Transcendental Meditation (TM), Sudarshan Kriya, and Landmark Ontology.",
      },
    ],
    recognitionLabel: "Recognition",
    recognitions: [
      "Life Changer Award - VIT, Vellore",
      "Distinguished Alumni Award - VIT, Vellore",
    ],
  },
  biography: {
    name: "Jothi Ramesh",
    headline: "PSYCHIC + INTUITIVE BUSINESS & MONEY COACH",
    fullBio:
      "Jothi Ramesh spent more than 21 years in software engineering before a profound inner shift called her from systems and code into spiritual coaching. Today, she integrates intuitive wisdom, money mindset work, and practical guidance to help people release fear, clear energetic blocks, and create aligned abundance. Her approach bridges strategy with soul, so success feels steady instead of stressful. Every program is rooted in one bold mission: to empower 25 million lives toward prosperity, purpose, and transformation.",
  },
  expertiseTags: [
    "Intuitive Coaching",
    "Money Mindset",
    "Spiritual Guidance",
    "Medium",
    "Clairaudience",
    "Clairsentience",
    "Claircognizance",
    "Clairvoyance",
    "Psychic Reading",
    "Tarot Mastery",
    "NLP Coach",
    "Ontology Coach",
  ],
  originDescription: 'What if your biggest business problem was never a strategy problem? After many years as a Software Engineer in the US and South Korea, I discovered that the most powerful breakthroughs happen not in boardrooms — but within. Inspired by a life-changing pilgrimage to Mount Kailash, I left tech to pursue a singular mission — to empower 25 million lives. As an Intuitive Business and Money Coach, I blend analytical rigor with psychic clarity, drawing on NLP, Ontology, Law of Attraction, Access Consciousness, and Psychic Intuition to help entrepreneurs identify what is truly holding them back — and move past it for good. My clients don\'t just grow their business. They transform their relationship with money, success, and themselves. With over 22 years of combined experience — from engineering boardrooms in the US and South Korea to transformational coaching rooms across the world — I bring a rare depth that no single discipline alone could ever offer.'
} as const;
