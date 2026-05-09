"use client";

import { PageBackdrop } from "@/components/ui/PageBackdrop";

/**
 * Shared shell for static info pages (Privacy, Terms, About, etc.).
 * Provides consistent layout, page backdrop, and entry animation.
 */
export function InfoPageShell({
  eyebrow,
  title,
  lead,
  children,
  maxWidth = "max-w-3xl",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative isolate min-h-[calc(100vh-3.5rem)]">
      <PageBackdrop />
      <div className={`relative z-10 mx-auto px-4 py-10 sm:py-16 ${maxWidth}`}>
        <header className="mb-10 anim-fade-up">
          {eyebrow && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-100 leading-tight mb-4">
            {title}
          </h1>
          {lead && <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">{lead}</p>}
        </header>
        <div className="anim-fade-in" style={{ animationDelay: "120ms" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ContentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
