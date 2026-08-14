import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

import { BlogPost } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

type BlogCardProps = {
  blog: BlogPost;
  reverse?: boolean;
};

export default function BlogCard({ blog, reverse = false }: BlogCardProps) {
  return (
    <article className="group w-full py-6 sm:py-8">
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-[#D4AF37]/22 bg-white/55 p-4 sm:p-5 md:p-6 shadow-[0_12px_28px_rgba(75,46,131,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(75,46,131,0.14)] ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10`}
      >
        {/* Gradient hover effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_12%_50%,rgba(212,175,55,0.16),transparent_40%),radial-gradient(circle_at_88%_50%,rgba(75,46,131,0.1),transparent_45%)]" />

        {/* Image Section */}
        <div className="w-full md:w-[45%] lg:w-[46%]">
          <Link href={`/blogs/${blog.id}`} className="block">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#D4AF37]/24 bg-[#4B2E83]/12 transition-colors duration-300 group-hover:border-[#D4AF37]/70">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 46vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E83]/22 via-transparent to-transparent" />
              </div>
            </div>
          </Link>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-[55%] lg:w-[54%]">
          {/* Meta info - Date and Tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.12em] text-[#A97A00]">
              {blog.publishedAt}
            </span>
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#4B2E83] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-bold leading-tight tracking-[0.07em] text-[#FFF4CB]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className={`${playfair.className} mt-3 sm:mt-4 md:mt-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-[#4B2E83]`}>
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-[#333333]/85"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {blog.excerpt}
          </p>

          {/* Read More Link */}
          <Link
            href={`/blogs/${blog.id}`}
            className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-[#A97A00] transition-colors duration-300 hover:text-[#4B2E83] group/link"
          >
            Continue Reading
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}