import type { Metadata } from "next";
import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Exactly which cookies and localStorage entries KalbaLab uses, and why.",
};

const LAST_UPDATED = "2026-05-08";

const COOKIES = [
  {
    name: "kalbalab-store",
    type: "localStorage",
    purpose: "Remembers your interface language, theme, audio autoplay preference, recent searches.",
    duration: "Until you clear it",
    essential: true,
  },
  {
    name: "klb-tr:<lang>:<text>",
    type: "localStorage",
    purpose: "Caches translations fetched for the Vocabulary native column so we don't re-fetch the same word.",
    duration: "Until you clear it",
    essential: false,
  },
  {
    name: "sb-* (Supabase auth)",
    type: "Cookie + localStorage",
    purpose: "Keeps you signed in. Set by Supabase when you log in.",
    duration: "Until you sign out (or 1 year, whichever is first)",
    essential: true,
  },
];

export default function CookiesPage() {
  return (
    <InfoPageShell
      eyebrow="Cookies"
      title="Cookie Policy"
      lead={`Last updated: ${LAST_UPDATED}. We use very few cookies — only what's needed to keep you signed in and remember your preferences. No tracking, no advertising.`}
    >
      <div className="space-y-6">
        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">What is a cookie?</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            A cookie is a small file your browser stores when you visit a website. <strong>localStorage</strong> is similar
            — it lets a site remember things between visits without expiring as quickly.
          </p>
          <p className="text-gray-300 leading-relaxed">
            KalbaLab uses both, but only for &quot;essential&quot; functions like keeping you signed in and remembering
            your language preference. We do <strong>not</strong> use any analytics, advertising, or tracking cookies.
          </p>
        </ContentCard>

        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-4">Cookies we use</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Essential</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name} className="border-b border-white/5">
                    <td className="px-2 py-3 text-amber-300 font-mono text-xs">{c.name}</td>
                    <td className="px-2 py-3 text-gray-300 text-xs">{c.type}</td>
                    <td className="px-2 py-3 text-gray-300 text-xs">{c.purpose}</td>
                    <td className="px-2 py-3 text-gray-400 text-xs">{c.duration}</td>
                    <td className="px-2 py-3">
                      {c.essential ? (
                        <span className="text-emerald-400 text-xs font-semibold">Essential</span>
                      ) : (
                        <span className="text-gray-500 text-xs">Helper</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>

        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">How to manage cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            You can clear all cookies and localStorage entries through your browser settings:
          </p>
          <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-1.5 mb-3">
            <li><strong>Chrome / Edge:</strong> Settings → Privacy and security → Clear browsing data</li>
            <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data</li>
            <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data → Clear Data</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            <strong>Heads up:</strong> if you clear the essential cookies, you&apos;ll be signed out and your interface
            language will reset to the default. Helper cookies can be safely cleared with no impact to functionality
            beyond losing the cached translations.
          </p>
        </ContentCard>

        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">Third-party cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            We don&apos;t embed third-party widgets that drop tracking cookies on our domain. The exceptions:
          </p>
          <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-1.5">
            <li><strong>Buy Me a Coffee</strong> — only loads on their own domain when you click the donate link.</li>
            <li><strong>Supabase</strong> — sets the auth cookie listed above. Required for sign-in to work.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-3">
            See our <a href="/privacy" className="text-amber-400 hover:text-amber-300">Privacy Policy</a> for the full list of services.
          </p>
        </ContentCard>

        <ContentCard>
          <h2 className="text-xl font-bold text-gray-100 mb-3">Questions?</h2>
          <p className="text-gray-300 leading-relaxed">
            Email <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300">armansalekofficial@gmail.com</a>.
          </p>
        </ContentCard>
      </div>
    </InfoPageShell>
  );
}
