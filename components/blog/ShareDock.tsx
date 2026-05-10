"use client";

import { useState } from "react";
import { Share2, Send, Globe, Link2, Check } from "lucide-react";

export function ShareDock({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { name: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, Icon: Share2 },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: Globe },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Send },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — silent */
    }
  };

  return (
    <div className="inline-flex flex-col gap-2 p-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold px-1.5 pt-1">Share</p>
      {links.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
