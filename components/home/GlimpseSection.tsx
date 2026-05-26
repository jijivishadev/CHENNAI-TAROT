"use client";

export default function GlimpseSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10">
      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-[#4B2E83]/20 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#4B2E83]">About the Coach</h3>
          <p className="mt-3 text-sm leading-6 text-[#333333]">
            I blend intuitive spiritual guidance with practical money strategy to help you align
            your energy, clear scarcity patterns, and welcome aligned prosperity.
          </p>
        </article>

        <article className="rounded-2xl border border-[#4B2E83]/20 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#4B2E83]">Client Testimonial</h3>
          <p className="mt-3 text-sm italic leading-6 text-[#333333]">
            &ldquo;In 90 days, I released deep abundance blockages and finally felt safe receiving more.
            My income doubled and my nervous system stayed grounded throughout.&rdquo;
          </p>
        </article>

        <article className="rounded-2xl border border-[#4B2E83]/20 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#4B2E83]">Contact / Let&apos;s Connect</h3>
          <p className="mt-3 text-sm leading-6 text-[#333333]">
            Ready to manifest your wealth with clarity and soul alignment? Reach out to explore
            your next coaching container.
          </p>
          <a
            href="/#site-footer"
            className="mt-4 inline-block rounded-full border border-[#4B2E83] px-4 py-2 text-sm font-medium text-[#4B2E83] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Connect Now
          </a>
        </article>
      </div>
    </section>
  );
}
