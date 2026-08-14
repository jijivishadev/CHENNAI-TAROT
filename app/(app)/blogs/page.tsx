"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";

import BlogCard from "@/components/blog/BlogCard";
import { getBlogPosts } from "@/lib/firebaseServices";
import { BlogPost } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function BlogsPage() {
  useEffect(() => {
    document.title = "Jothi Ramesh - Psychic | Intuitive Business and Money Coach - Blogs";
  }, []);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  const displayedBlogs = posts.slice(0, visibleCount);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const records = await getBlogPosts();
        const mappedPosts: BlogPost[] = records.map((record) => ({
          id: record.slug || record.id,
          title: record.title,
          publishedAt: record.publishedAt,
          tags: record.tags,
          excerpt: record.excerpt || record.shortDescription,
          imageUrl: record.imageUrl || "/bannerimg.jpg",
          imageAlt: record.imageAlt || record.title,
          readTime: record.readTime,
          author: record.author,
          richContent: record.richContent, // ✅ added richContent
        }));

        console.log("[BlogsPage] Firestore blogs fetched:", mappedPosts.length);
        setPosts(mappedPosts);
      } catch (error) {
        console.error("[BlogsPage] Error fetching Firestore blogs:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F3ECFF_0%,#EEE4FF_46%,#F3ECFF_100%)] pb-16 sm:pb-20 md:pb-24 pt-8 sm:pt-10 md:pt-12 font-sans text-[#333333]">
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl py-4 sm:py-6 md:py-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#D4AF37]">
              Blogs
            </p>
            <h1 className={`${playfair.className} mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-[4.1rem] leading-tight text-[#4B2E83]`}>
              Insights on Wealth, Energy, and Leadership
            </h1>
            <p className="mx-auto mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed sm:leading-8 text-[#333333]/78 max-w-3xl">
              Practical reflections to help you build abundance that is strategic, sustainable, and spiritually aligned.
            </p>
            <div className="mx-auto mt-5 sm:mt-6 h-px w-20 sm:w-28 bg-[#D4AF37]/70" />
          </div>

          <div className="mx-auto mt-8 sm:mt-10 md:mt-12">
            {loading ? (
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/60 px-6 py-12 text-center text-[#4B2E83]">
                Loading blogs...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/60 px-6 py-12 text-center text-[#4B2E83]">
                No blogs are currently available.
              </div>
            ) : (
              <>
                {displayedBlogs.map((blog, index) => (
                  <div key={`${blog.id}-${index}`} className="border-t border-[#D4AF37]/12 first:border-t-0">
                    <BlogCard blog={blog} reverse={index % 2 === 1} />
                  </div>
                ))}

                {posts.length > 3 && (
                  <div className="mt-8 flex justify-center">
                    {visibleCount < posts.length ? (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => Math.min(prev + 3, posts.length))}
                        className="rounded-full border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#1A0B2E] transition hover:bg-[#cfae2d]"
                      >
                        Show More Blogs
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setVisibleCount(3);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-full border border-[#4B2E83] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#4B2E83] transition hover:bg-[#F3ECFF]"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}