import type { Metadata } from "next";
import { InfoPageShell, ContentCard } from "@/components/ui/InfoPageShell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for using KalbaLab — short, fair, and written in plain English.",
};

const LAST_UPDATED = "2026-05-08";

export default function TermsPage() {
  return (
    <InfoPageShell
      eyebrow="Legal"
      title="Terms of Use"
      lead={`Last updated: ${LAST_UPDATED}. Plain-language terms — no surprises. By using KalbaLab you agree to these terms.`}
    >
      <ContentCard>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">1. Acceptance</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing KalbaLab (the &quot;Service&quot;) you agree to be bound by these Terms.
              If you don&apos;t agree, please don&apos;t use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">2. Free service</h2>
            <p className="text-gray-300 leading-relaxed">
              KalbaLab is provided free of charge. There is no premium tier. Optional voluntary donations
              (Buy Me a Coffee) help cover server costs and don&apos;t unlock additional features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">3. Your account</h2>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-2">
              <li>You must be at least 16 years old to create an account.</li>
              <li>Provide accurate information and keep your password secure.</li>
              <li>You&apos;re responsible for activity under your account.</li>
              <li>One account per person, please.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">4. Acceptable use</h2>
            <p className="text-gray-300 leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc list-outside pl-5 text-gray-300 leading-relaxed space-y-2">
              <li>Scrape, copy, or redistribute large portions of the lesson content for commercial use.</li>
              <li>Reverse-engineer or attack the Service.</li>
              <li>Spam, harass, or impersonate other users.</li>
              <li>Use the Service for anything illegal under Lithuanian or EU law.</li>
              <li>Abuse the translation/audio API endpoints (rate limits apply).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">5. Content ownership</h2>
            <p className="text-gray-300 leading-relaxed">
              Lesson content, vocabulary lists, the user interface, and the KalbaLab name and logo are
              owned by the project authors and are licensed to you for personal, non-commercial educational use.
              Lithuanian language itself is, of course, not owned by anyone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">6. Third-party content</h2>
            <p className="text-gray-300 leading-relaxed">
              Translations may be provided by third-party services (Google Translate, MyMemory, etc.).
              We don&apos;t guarantee perfect accuracy of those machine translations — they&apos;re a helper, not a substitute
              for a qualified language teacher when stakes are high (e.g. legal documents).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">7. No warranty / no exam guarantee</h2>
            <p className="text-gray-300 leading-relaxed">
              KalbaLab is provided &quot;as is&quot;. We work hard on quality but cannot guarantee that using KalbaLab
              will result in passing the official A1 Lithuanian exam — that depends on your effort, the examiner, and
              factors outside our control. The Service may be unavailable from time to time for maintenance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">8. Limitation of liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by Lithuanian law, KalbaLab and its authors are not liable for any
              indirect, incidental, or consequential damages arising out of your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">9. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              You can stop using KalbaLab and delete your account at any time. We may suspend accounts that violate
              these Terms, with reasonable notice when possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">10. Changes</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these Terms occasionally. Material changes will update the &quot;last updated&quot; date
              and, when they affect your rights, we&apos;ll notify you by email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">11. Governing law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms are governed by the laws of the Republic of Lithuania. Any disputes will be resolved
              in the competent courts of Lithuania.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-100 mb-2">12. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions about these Terms?{" "}
              <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300">armansalekofficial@gmail.com</a>
            </p>
          </section>
        </div>
      </ContentCard>
    </InfoPageShell>
  );
}
