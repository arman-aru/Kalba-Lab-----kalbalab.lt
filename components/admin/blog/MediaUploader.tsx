"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import type { ImageRef } from "@/lib/blog/schema";

export function MediaUploader({
  value,
  onChange,
}: {
  value: ImageRef | null;
  onChange: (image: ImageRef | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState(value?.alt ?? "");

  const upload = async (file: File) => {
    setError(null);
    if (altDraft.trim().length < 4) {
      setError("Add alt text (≥4 chars) before uploading.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt", altDraft.trim());
      const res = await fetch("/api/admin/blog/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Upload failed");
        return;
      }
      onChange({
        url: json.url,
        alt: altDraft.trim(),
        width: json.width,
        height: json.height,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
        Featured image
      </label>

      <input
        type="text"
        value={altDraft}
        onChange={(e) => {
          setAltDraft(e.target.value);
          if (value) onChange({ ...value, alt: e.target.value });
        }}
        placeholder="Alt text (required, ≥4 chars)"
        className="w-full px-3 h-10 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-gray-100 placeholder:text-gray-600 focus:border-amber-500/40 focus:outline-none"
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.url} alt={value.alt} className="w-full h-auto max-h-72 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-gray-200 hover:text-red-300"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-10 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-amber-500/40 hover:bg-white/[0.04] transition-colors text-gray-400 disabled:opacity-50"
        >
          <Upload size={20} />
          <span className="text-sm font-semibold">{uploading ? "Uploading…" : "Click to upload (auto-converted to WebP)"}</span>
          <span className="text-xs text-gray-500">PNG, JPG, WebP up to 8 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
