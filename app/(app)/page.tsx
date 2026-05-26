"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PromotionalEventOverlay from "@/components/home/PromotionalEventOverlay";
import HeroBanner from "@/components/home/HeroBanner";
import { homeContent } from "@/src/content/home";
import { CoachingPlan } from "@/types";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import { getHomeMessageContent, getCoachingPlans } from "@/lib/firebaseServices";

const LazyOfferStack = dynamic(() => import("@/components/home/OfferStack"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full animate-pulse bg-gray-100 rounded-3xl my-8" />
});
const LazyCoachStory = dynamic(() => import("@/components/home/CoachStory"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-gray-100 my-8" />
});
const LazyProgramsResources = dynamic(() => import("@/components/home/ProgramsResources"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-100 my-8" />
});
const LazyVideoProofGrid = dynamic(() => import("@/components/home/VideoProofGrid"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-gray-100 my-8" />
});

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

const sectionReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

function isRemoteAssetUrl(value?: string): value is string {
  if (!value || typeof value !== "string") return false;
  return /^https?:\/\//i.test(value.trim());
}

function normalizeCoachingPlans(plans: CoachingPlan[]): CoachingPlan[] {
  const incomingById = new Map(plans.map((plan) => [plan.id, plan] as [string, CoachingPlan]));
  const expectedPlans = ["plan-discovery", "plan-3-month", "plan-1-year"]
    .map((id) => incomingById.get(id))
    .filter((plan): plan is CoachingPlan => Boolean(plan));
  const extraPlans = plans.filter((plan) => !["plan-discovery", "plan-3-month", "plan-1-year"].includes(plan.id));
  return [...expectedPlans, ...extraPlans];
}

export default function HomePage() {
  const { assets } = useSiteAssets();
  const [homeMessage, setHomeMessage] = useState<{ title: string; paragraphs: string[] }>({
    title: homeContent.missionStatement.title,
    paragraphs: [...homeContent.missionStatement.paragraphs],
  });
  const [coachingPlans, setCoachingPlans] = useState<CoachingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const loadHomeMessage = async () => {
      try {
        const data = await getHomeMessageContent();
        setHomeMessage({
          title: data.title,
          paragraphs: data.paragraphs,
        });
      } catch (error) {
        console.error("Error loading home message:", error);
        setHomeMessage({
          title: homeContent.missionStatement.title,
          paragraphs: [...homeContent.missionStatement.paragraphs],
        });
      }
    };

    const loadCoachingPlans = async () => {
      setPlansLoading(true);
      try {
        const plans = await getCoachingPlans();
        if (plans && plans.length > 0) {
          setCoachingPlans(normalizeCoachingPlans(plans));
        } else {
          setCoachingPlans([]);
        }
      } catch (error) {
        console.error("Error loading coaching plans:", error);
        setCoachingPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    loadHomeMessage();
    loadCoachingPlans();
  }, []);

  const discoveryImageUrl = isRemoteAssetUrl(assets.discoveryImageUrl)
    ? assets.discoveryImageUrl.trim()
    : undefined;
  
  return (
    <>
      <Head>
        <title>Jothi Ramesh - Psychic | Intuitive Business and Money Coach</title>
      </Head>

      <main className="min-h-screen w-full bg-white font-sans text-[#333333] pt-[5rem] sm:pt-[5rem]">
        <PromotionalEventOverlay />
        <HeroBanner />

        <motion.section
          className="relative w-full overflow-hidden bg-[#E8E0FF] py-24"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
        >
          <div className="pointer-events-none absolute inset-0" />
          <div className="relative mx-auto w-full max-w-5xl px-12 text-center">
            <h2 className={`${playfair.className} mt-4 text-4xl text-[#4B2E83] sm:text-5xl`}>
              {homeMessage.title}
            </h2>
            <div className="mt-8 space-y-0 text-lg leading-8 text-[#333333]">
              {homeMessage.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <LazyOfferStack plans={coachingPlans} discoveryImageUrl={discoveryImageUrl} isLoading={plansLoading} />
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <LazyCoachStory originImageUrl1={assets.originImageUrl1} />
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <LazyProgramsResources />
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <LazyVideoProofGrid />
        </motion.div>
      </main>
    </>
  );
}