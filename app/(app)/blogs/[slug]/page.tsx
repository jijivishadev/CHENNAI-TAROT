"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Head from "next/head";
import { Playfair_Display } from "next/font/google";
import { ArrowLeft, Clock3 } from "lucide-react";

import { BlogPost } from "@/types";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setPost(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { getBlogPosts } = await import("@/lib/firebaseServices");
        const records = await getBlogPosts();
        const match = records.find((record) => (record.slug || record.id) === slug);
        if (!match) {
          setPost(null);
        } else {
          const htmlContent = match.richContent || "";
          const nextPost = {
            id: match.slug || match.id,
            title: match.title,
            publishedAt: match.publishedAt,
            tags: match.tags,
            excerpt: match.excerpt || match.shortDescription,
            imageUrl: match.imageUrl || "/bannerimg.jpg",
            imageAlt: match.imageAlt || match.title,
            readTime: match.readTime,
            author: match.author,
            content: htmlContent,
            richContent: htmlContent,
          };
          setPost(nextPost);
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [slug]);

  useEffect(() => {
    if (post) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && typeof activeElement.blur === "function") {
        activeElement.blur();
      }

      const focusable = document.querySelectorAll(
        "a, button, input, textarea, select, iframe, [tabindex]:not([tabindex='-1'])"
      );

      focusable.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (typeof htmlElement.blur === "function") {
          htmlElement.blur();
        }
      });
    }
  }, [slug, post]);

  const renderSkeleton = () => (
    <main className="w-full min-h-[85vh] flex flex-col justify-start bg-[#faf8ff] py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-32 rounded-full bg-[#E8DEF9]" />
          <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-white shadow-xl">
            <div className="h-[300px] w-full bg-[#F0E8FF]" />
            <div className="space-y-5 p-6 sm:p-8 md:p-12">
              <div className="flex gap-3">
                <div className="h-5 w-24 rounded-full bg-[#E8DEF9]" />
                <div className="h-5 w-24 rounded-full bg-[#F0E8FF]" />
                <div className="h-5 w-20 rounded-full bg-[#E8DEF9]" />
              </div>
              <div className="h-12 w-3/4 rounded-md bg-[#E8DEF9]" />
              <div className="h-5 w-40 rounded-md bg-[#F0E8FF]" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-[#F0E8FF]" />
                <div className="h-4 w-full rounded bg-[#E8DEF9]" />
                <div className="h-4 w-5/6 rounded bg-[#F0E8FF]" />
                <div className="h-4 w-full rounded bg-[#E8DEF9]" />
                <div className="h-4 w-4/5 rounded bg-[#F0E8FF]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  if (loading || !post) {
    return renderSkeleton();
  }

  const htmlContent = post.content || post.richContent || "<p>No content available.</p>";

  return (
    <>
      <Head>
        <title>{post.title} | Jothi Ramesh</title>
      </Head>
      <main id="blog-top" className="w-full min-h-[85vh] flex flex-col justify-start bg-[#faf8ff] py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-white/85 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#4B2E83] hover:border-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white/65 shadow-xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="px-5 py-8 sm:px-8 md:px-12">
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold uppercase text-[#D4AF37]">
                <span>{post.publishedAt}</span>
                {post.readTime && <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" /> {post.readTime}</span>}
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded-full bg-[#4B2E83] px-2 py-0.5 text-[10px] text-white">{tag}</span>
                ))}
              </div>
              <h1 className={`${playfair.className} mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#4B2E83]`}>
                {post.title}
              </h1>
              {post.author && <p className="mt-2 text-sm font-semibold uppercase text-gray-600">By {post.author}</p>}

              <div className="w-full max-w-full mx-auto block text-left overflow-visible">
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="block w-full [&_*]:block [&_span]:inline [&_a]:inline [&_strong]:inline [&_b]:inline [&_i]:inline [&_em]:inline [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_p]:my-3 [&_p]:leading-relaxed"
                />
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}