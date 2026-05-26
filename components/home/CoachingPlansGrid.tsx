"use client";

type Plan = {
  title: string;
  description: string;
  price: string;
  highlights: string[];
};

type CoachingPlansGridProps = {
  plans: Plan[];
};

export default function CoachingPlansGrid({ plans }: CoachingPlansGridProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10">
      <div className="mb-8 space-y-2 text-center">
        <h2 className="text-3xl font-bold text-[#4B2E83] sm:text-4xl">Coaching Plans</h2>
        <p className="text-[#333333]">Choose the container that matches your next level.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.title}
            className="rounded-2xl border border-transparent bg-white p-6 shadow-md transition-all duration-300 hover:border-[#D4AF37] hover:shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-[#4B2E83]">{plan.title}</h3>
            <p className="mt-1 text-lg font-medium text-[#333333]">{plan.price}</p>
            <p className="mt-3 text-sm leading-6 text-[#333333]">{plan.description}</p>

            <ul className="mt-5 space-y-2 text-sm text-[#333333]">
              {plan.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
