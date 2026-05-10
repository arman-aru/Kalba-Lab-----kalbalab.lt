"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPostListItem } from "@/lib/blog/schema";

export function FeaturedHero({ post }: { post: BlogPostListItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
    >
      <Link href={`/blog/${post.slug}`} prefetch className="grid lg:grid-cols-2 gap-0">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />
        </div>

        <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              Featured
            </span>
            <span className="inline-flex text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 font-semibold">
              {post.category.name}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-50 leading-tight tracking-tight mb-4">
            {post.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} /> {post.readingMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold text-sm">
              Read article <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
