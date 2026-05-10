"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import type { BlogPostListItem } from "@/lib/blog/schema";

export function BlogCard({ post, priority = false }: { post: BlogPostListItem; priority?: boolean }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-amber-500/40 transition-colors"
    >
      <Link href={`/blog/${post.slug}`} prefetch className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
          {/* Plain <img> so we don't require domain config in next.config; swap to next/image once remotePatterns is set */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            width={post.featuredImage.width}
            height={post.featuredImage.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="absolute top-3 left-3 inline-flex text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold backdrop-blur">
            {post.category.name}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-gray-100 text-lg leading-snug mb-2 group-hover:text-amber-200 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} /> {post.readingMinutes} min read
            </span>
            <ArrowUpRight size={14} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
