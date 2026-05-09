"use client";

import { useState, useTransition } from "react";
import { Mail, Archive, AlertOctagon, Trash2, Check } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

const ACTIONS = [
  { value: "read",     label: "Mark read", icon: Check },
  { value: "archived", label: "Archive",   icon: Archive },
  { value: "spam",     label: "Spam",      icon: AlertOctagon },
  { value: "delete",   label: "Delete",    icon: Trash2, danger: true },
] as const;

export function MessageRow({ message }: { message: Message }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(message.status);

  if (hidden) return null;

  const act = (action: (typeof ACTIONS)[number]["value"]) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, action }),
      });
      if (!res.ok) return;
      if (action === "delete") setHidden(true);
      else setStatus(action);
    });
  };

  const isNew = status === "new";

  return (
    <div className={`rounded-2xl border bg-[var(--surface)]/60 backdrop-blur-sm transition-colors ${isNew ? "border-amber-500/30" : "border-white/10"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${isNew ? "bg-amber-500/15 text-amber-300" : "bg-white/5 text-gray-400"}`}>
            <Mail size={14} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-100 truncate">{message.name}</span>
              <span className="text-xs text-gray-500 truncate">&lt;{message.email}&gt;</span>
              {isNew && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">New</span>}
            </div>
            <p className="text-sm text-gray-300 mt-0.5 truncate">{message.subject || "(no subject)"}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{message.message.slice(0, 140)}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">{new Date(message.created_at).toLocaleString()}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="rounded-xl border border-white/5 bg-black/30 p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent("Re: " + (message.subject ?? "Your message"))}`}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold"
            >
              <Mail size={14} /> Reply
            </a>
            {ACTIONS.map((a) => (
              <button
                key={a.value}
                onClick={() => act(a.value)}
                disabled={pending}
                className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm border ${
                  a.danger
                    ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                    : "border-white/10 text-gray-300 hover:bg-white/5"
                } disabled:opacity-50`}
              >
                <a.icon size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
