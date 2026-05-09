"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export type IdentifierMode = "email" | "phone";

export const COUNTRIES: { code: string; dial: string; flag: string; name: string }[] = [
  { code: "LT", dial: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "AZ", dial: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "IN", dial: "+91",  flag: "🇮🇳", name: "India" },
  { code: "KG", dial: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "MA", dial: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "PK", dial: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "TJ", dial: "+992", flag: "🇹🇯", name: "Tajikistan" },
  { code: "TR", dial: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "UZ", dial: "+998", flag: "🇺🇿", name: "Uzbekistan" },
];

interface Labels {
  email: string;
  phone: string;
  emailLabel: string;
  phoneLabel: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
}

interface Props {
  mode: IdentifierMode;
  setMode: (m: IdentifierMode) => void;
  email: string;
  setEmail: (v: string) => void;
  phoneLocal: string;        // local digits only (no country code)
  setPhoneLocal: (v: string) => void;
  countryDial: string;
  setCountryDial: (v: string) => void;
  labels: Labels;
}

export function PhoneEmailField({
  mode, setMode, email, setEmail, phoneLocal, setPhoneLocal, countryDial, setCountryDial, labels,
}: Props) {
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const country = COUNTRIES.find((c) => c.dial === countryDial) ?? COUNTRIES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex p-1 mb-3 rounded-xl border border-white/10 bg-black/20" role="tablist">
        {([
          { id: "email", icon: Mail,  label: labels.email },
          { id: "phone", icon: Phone, label: labels.phone },
        ] as const).map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMode(t.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {mode === "email" ? (
        <>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            {labels.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={labels.emailPlaceholder}
            className="w-full px-3.5 py-3 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
          />
        </>
      ) : (
        <>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            {labels.phoneLabel}
          </label>
          <div className="flex rounded-xl border border-white/10 bg-black/30 focus-within:border-amber-500/50 focus-within:bg-black/40 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            {/* Country code dropdown */}
            <div ref={ddRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="h-full flex items-center gap-1.5 pl-3 pr-2 py-3 text-sm text-gray-200 hover:text-amber-300 transition-colors border-r border-white/10 rounded-l-xl"
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="font-medium">{country.dial}</span>
                <ChevronDown size={12} className={cn("opacity-60 transition-transform", open && "rotate-180")} />
              </button>
              {open && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] w-56 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-[var(--surface)] shadow-2xl py-1 z-50"
                  style={{ animation: "menuIn 180ms ease-out" }}
                >
                  {COUNTRIES.map((c) => {
                    const sel = c.dial === countryDial;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        role="option"
                        aria-selected={sel}
                        onClick={() => { setCountryDial(c.dial); setOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                          sel ? "bg-amber-500/10 text-amber-300" : "text-gray-200 hover:bg-white/5"
                        )}
                      >
                        <span className="text-lg leading-none">{c.flag}</span>
                        <span className="flex-1 text-left">{c.name}</span>
                        <span className="text-gray-500 font-mono text-xs">{c.dial}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              type="tel"
              inputMode="tel"
              value={phoneLocal}
              onChange={(e) => setPhoneLocal(e.target.value.replace(/[^\d\s-]/g, ""))}
              required
              placeholder={labels.phonePlaceholder}
              className="flex-1 min-w-0 px-3 py-3 bg-transparent text-gray-100 placeholder-gray-600 outline-none text-sm rounded-r-xl"
            />
          </div>
        </>
      )}
    </div>
  );
}

/** Build the canonical identifier string from current state. */
export function buildIdentifier(mode: IdentifierMode, email: string, dial: string, phoneLocal: string): string {
  if (mode === "email") return email.trim();
  return `${dial}${phoneLocal.replace(/[^\d]/g, "")}`;
}
