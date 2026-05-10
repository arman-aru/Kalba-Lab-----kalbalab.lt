import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";
import { SEO } from "@/components/seo/SEO";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { SITE, abs } from "@/lib/seo/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How KalbaLab handles your personal data, learning progress, and the few third-party services we use. We collect the minimum we need to make the platform work.",
  path: "/privacy",
});

const LAST_UPDATED = "2026-05-08";

const PRIVACY_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": abs("/privacy"),
  url: abs("/privacy"),
  name: "Privacy Policy",
  inLanguage: "en",
  isPartOf: { "@id": `${SITE.url}#website` },
  dateModified: LAST_UPDATED,
  about: { "@id": `${SITE.url}#organization` },
};

export default function PrivacyPage() {
  return (
    <>
      <SEO blocks={[
        PRIVACY_LD,
        breadcrumbLd([
          { name: "Home", url: SITE.url },
          { name: "Privacy", url: abs("/privacy") },
        ]),
      ]} />
    <InfoPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      lead={`Last updated: ${LAST_UPDATED}. We collect the minimum we need to make KalbaLab work, we don't sell anything, and you can delete your account at any time.`}
    >
      <ContentCard>
        <div className="prose-lt space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">1. Who we are</h2>
            <p className="text-gray-300 leading-relaxed">
              KalbaLab is a free Lithuanian language learning platform operated as a personal project.
              For privacy questions reach us at{" "}
              <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300">armansalekofficial@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">2. What we collect</h2>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-2">
              <li><strong>Account data</strong> — full name, email, hashed password (or Google OAuth identifier).</li>
              <li><strong>Learning progress</strong> — words you&apos;ve marked, lessons completed, quiz scores, XP, streak counter, daily goal.</li>
              <li><strong>Preferences</strong> — chosen UI language, theme (light/dark), audio autoplay preference. Stored in your browser&apos;s <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">localStorage</code>.</li>
              <li><strong>Translation cache</strong> — translations you trigger via the &quot;native column&quot; are cached in your browser&apos;s <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">localStorage</code> so we don&apos;t hit the translation API repeatedly.</li>
              <li><strong>Server logs</strong> — standard request logs (IP, user-agent, URL) kept short-term for debugging and abuse prevention.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">3. What we do NOT collect</h2>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-2">
              <li>We don&apos;t track you across other sites.</li>
              <li>We don&apos;t use ad networks or data brokers.</li>
              <li>We don&apos;t sell your data, ever.</li>
              <li>We don&apos;t collect payment information (the app is free).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">4. Third-party services we use</h2>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-2">
              <li><strong>Supabase</strong> — hosts our database (account & progress) and authentication. Their privacy policy applies to data at rest on their servers.</li>
              <li><strong>Google Translate (translate.googleapis.com)</strong> — used for native-language column on the Vocabulary page. Only the English source word is sent; your account is never associated with translation requests.</li>
              <li><strong>MyMemory Translation API</strong> — backup translation provider, same scope as above.</li>
              <li><strong>Google Text-to-Speech</strong> — generates Lithuanian audio. Only the Lithuanian word/sentence is sent.</li>
              <li><strong>Buy Me a Coffee</strong> — optional donation link on our footer. Their privacy policy applies if you choose to donate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">5. Cookies & local storage</h2>
            <p className="text-gray-300 leading-relaxed">
              We use a single first-party cookie / localStorage entry to remember your sign-in session and preferences.
              We do not use advertising, analytics, or tracking cookies. See our{" "}
              <a href="/cookies" className="text-amber-400 hover:text-amber-300">Cookie Policy</a> for the full list.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">6. How long we keep data</h2>
            <p className="text-gray-300 leading-relaxed">
              Account data is stored as long as your account exists. If you delete your account (via the Profile page or by emailing us),
              all associated learning progress is permanently removed within 30 days. Server logs are deleted after 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">7. Your rights</h2>
            <p className="text-gray-300 leading-relaxed mb-2">Under EU GDPR (Lithuania is in the EU), you have the right to:</p>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-1">
              <li>Access — get a copy of your data.</li>
              <li>Correction — fix anything inaccurate.</li>
              <li>Deletion — close your account and remove all your data.</li>
              <li>Export — receive your data in a portable format.</li>
              <li>Object / restrict processing.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              To exercise any of these, email <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300">armansalekofficial@gmail.com</a>. We respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">8. Children</h2>
            <p className="text-gray-300 leading-relaxed">
              KalbaLab is intended for adult learners. We don&apos;t knowingly collect data from children under 16. If you believe a child has signed up, contact us and we&apos;ll remove the account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">9. Changes to this policy</h2>
            <p className="text-gray-300 leading-relaxed">
              If we materially change how we handle data, we&apos;ll update the &quot;last updated&quot; date and, where required, notify you by email.
            </p>
          </section>
        </div>
      </ContentCard>
    </InfoPageShell>
    </>
  );
}
