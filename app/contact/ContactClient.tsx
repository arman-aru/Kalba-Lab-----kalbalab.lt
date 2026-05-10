"use client";

import { useState } from "react";
import { Mail, Send, MessageSquare, Coffee, CheckCircle2, Loader2 } from "lucide-react";
import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";

const CONTACT_EMAIL = "armansalekofficial@gmail.com";
const COFFEE_URL    = "https://www.buymeacoffee.com/kalbalab";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send. Try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InfoPageShell
      eyebrow="Contact"
      title="Get in touch"
      lead="Questions, feedback, translation corrections, or just saying hi — we read every message. Replies usually within 1–2 days."
      maxWidth="max-w-5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <ContentCard className="lg:col-span-3">
          {sent ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-4">
                <CheckCircle2 size={26} />
              </div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">Message sent</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Thanks for reaching out — we usually reply within 1–2 days at <span className="text-amber-400">{email}</span>.
              </p>
              <button
                onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                className="mt-6 text-xs text-gray-500 hover:text-amber-300 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-100 mb-1">Send us a message</h2>
              <p className="text-gray-400 text-sm mb-4">We&apos;ll respond at the email you provide.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Arman"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Suggestion, bug, translation help…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell us what you need…"
                  className="w-full px-3.5 py-3 rounded-xl border border-white/10 bg-black/30 text-gray-100 placeholder-gray-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-y"
                />
              </div>

              {/* Honeypot — invisible to humans */}
              <input
                type="text"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
              />

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/25"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </ContentCard>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <ContentCard>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-3">
              <Mail size={18} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">Email</h3>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-amber-400 hover:text-amber-300 break-all">
              {CONTACT_EMAIL}
            </a>
            <p className="text-gray-500 text-xs mt-2">Direct line — fastest way to reach us.</p>
          </ContentCard>

          <ContentCard>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">Reporting a translation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Found a wrong translation in your language? Tell us the word and the correct version — we&apos;ll fix it within a few days.
            </p>
          </ContentCard>

          <ContentCard>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 mb-3">
              <Coffee size={18} />
            </div>
            <h3 className="font-bold text-gray-100 mb-1">Support the project</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              KalbaLab is free to use. If we helped you, a small tip keeps the lights on.
            </p>
            <a
              href={COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              <Coffee size={14} /> Buy me a coffee
            </a>
          </ContentCard>
        </div>
      </div>
    </InfoPageShell>
  );
}
