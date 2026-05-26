import Link from "next/link";

import { CoachingPlan } from "@/types";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

type OfferStackProps = {
  plans: CoachingPlan[];
  discoveryImageUrl?: string;
  isLoading?: boolean;
};

function PillCTA({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-7 py-3 font-bold uppercase tracking-wide text-[#4B2E83] shadow-[0_10px_26px_rgba(75,46,131,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4B2E83] hover:bg-[#4B2E83] hover:text-[#D4AF37] hover:shadow-[0_16px_36px_rgba(75,46,131,0.28)] sm:w-auto"
    >
      <span className="font-semibold text-base">{label}</span>
      <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4B2E83] transition-colors duration-300 group-hover:rotate-[-35deg] group-hover:bg-[#D4AF37]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 text-[#D4AF37] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:-rotate-[18deg] group-hover:text-[#4B2E83]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}

export default function OfferStack({ plans, isLoading = false }: OfferStackProps) {
  const planPriority: Record<string, number> = {
    "plan-discovery": 1,
    "plan-3-month": 2,
    "plan-1-year": 3,
  };

  const orderedPlans = [...plans].sort((a, b) => {
    const aOrder = planPriority[a.id] ?? 999;
    const bOrder = planPriority[b.id] ?? 999;
    return aOrder - bOrder;
  });

  const discoveryPlan =
    orderedPlans.find((plan) => plan.id === "plan-discovery") ||
    orderedPlans.find((plan) => plan.isDiscoveryCall) ||
    orderedPlans[0];

  const standardPlans = orderedPlans.filter((plan) => plan.id !== discoveryPlan?.id).slice(0, 2);
  const allPlans = discoveryPlan ? [discoveryPlan, ...standardPlans] : standardPlans;
  const showLoading = isLoading || allPlans.length < 3;

  const resolveButtonLink = (plan: CoachingPlan) => {
    const rawLink = plan.buttonLink?.trim();
    if (rawLink) return rawLink;
    return "/#site-footer";
  };

  return (
    <section id="home-discovery" className="relative w-full overflow-hidden bg-[#F3ECFF] py-24 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_transparent_0%,_transparent_48%,_rgba(75,46,131,0.07)_48%,_rgba(75,46,131,0.07)_100%)]" />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 sm:px-10">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Mastermind</p>
          <h2 className={`${playfair.className} mt-3 text-4xl text-[#4B2E83] sm:text-5xl`}>Discovery & Coaching</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#333333]/75">
            Start with the Discovery Call or step directly into our high-touch coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3 md:gap-6">
          {showLoading
            ? Array.from({ length: 3 }).map((_, idx) => {
                const isFeaturedSkeleton = idx === 2;

                return (
                  <article
                    key={`offer-skeleton-${idx}`}
                    className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-[#1F1531] shadow-[0_18px_48px_rgba(30,16,57,0.22)] ${isFeaturedSkeleton ? "ring-2 ring-[#D4AF37]" : "border border-[#4B2E83]/10"}`}
                  >
                    <div className={`h-1.5 w-full ${isFeaturedSkeleton ? "bg-[#D4AF37]" : "bg-[#4B2E83]/20"}`} />
                    {isFeaturedSkeleton ? <span className="absolute right-5 top-5 h-6 w-28 animate-pulse rounded-full bg-[#D4AF37]" /> : null}

                    <div className="flex flex-1 flex-col p-8 sm:p-10">
                      <div className="h-10 w-56 animate-pulse rounded bg-[#D4AF37]/38" />
                      <div className="mt-4 h-10 w-32 animate-pulse rounded bg-white/20" />

                      <div className="mt-5 space-y-3">
                        <div className="h-4 w-[90%] animate-pulse rounded bg-white/18" />
                        <div className="h-4 w-[78%] animate-pulse rounded bg-white/18" />
                      </div>

                      <ul className="mt-7 flex-1 space-y-3">
                        <li className="h-3 w-[62%] animate-pulse rounded bg-white/15" />
                        <li className="h-3 w-[69%] animate-pulse rounded bg-white/15" />
                        <li className="h-3 w-[58%] animate-pulse rounded bg-white/15" />
                      </ul>

                      <div className="mt-8 h-14 w-52 animate-pulse rounded-full bg-[#D4AF37]/70" />
                    </div>
                  </article>
                );
              })
            : allPlans.map((plan) => {
                const isDiscovery = plan.id === discoveryPlan?.id;
                const isFeatured = plan.id === "plan-1-year";

                return (
                  <article
                    key={plan.id}
                    className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-[#1F1531] shadow-[0_18px_48px_rgba(30,16,57,0.22)] transition-all duration-300 hover:shadow-[0_26px_60px_rgba(30,16,57,0.28)] ${isFeatured ? "ring-2 ring-[#D4AF37]" : "border border-[#4B2E83]/10"}`}
                  >
                    <div className={`h-1.5 w-full ${isFeatured ? "bg-[#D4AF37]" : "bg-[#4B2E83]/20"}`} />

                    {isFeatured ? (
                      <span className="absolute right-5 top-5 rounded-full bg-[#D4AF37] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4B2E83]">
                        Most Popular
                      </span>
                    ) : null}

                    <div className="flex h-full flex-1 flex-col p-8 sm:p-10">
                      {isDiscovery ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">The Blueprint</p> : null}

                      <h3 className={`${playfair.className} mt-2 text-2xl text-[#D4AF37] sm:text-3xl`}>{plan.title}</h3>

                      <p className="mt-3 text-3xl font-bold text-white">{plan.price}</p>

                      <p className="mt-4 text-lg leading-8 text-white/85">{plan.description}</p>

                      <ul className="mt-6 flex-1 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-lg text-white/85">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <PillCTA href={resolveButtonLink(plan)} label={isDiscovery ? "Book Your Call" : "Apply Now"} />
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}

