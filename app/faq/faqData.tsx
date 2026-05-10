import type { ReactNode } from "react";

export type FaqEntry = { q: string; aText: string; a: ReactNode };

/**
 * FAQ source of truth used by both the interactive client and the FAQPage JSON-LD.
 * `aText` is the plain-text version emitted to schema.org/FAQPage so AI engines
 * and rich results have a stable, link-free string to quote.
 */
export const FAQS: FaqEntry[] = [
  {
    q: "Is KalbaLab really free?",
    aText:
      "Yes — KalbaLab is free to use, with no ads. We rely on optional Buy Me a Coffee donations to keep the servers running.",
    a: (
      <>
        Yes — KalbaLab is free to use, with no ads. We rely on optional{" "}
        <a href="https://www.buymeacoffee.com/kalbalab" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium">
          Buy Me a Coffee
        </a>{" "}
        donations to keep the servers running.
      </>
    ),
  },
  {
    q: "What is the A1 Lithuanian exam?",
    aText:
      "The A1 Lithuanian Language Integration Test is required for most foreigners renewing their Lithuanian residence permit. The fee is around €52 (2026). You need 50% overall with a minimum of 25% in each section to pass. KalbaLab covers all four sections: reading, writing, listening, and speaking.",
    a: (
      <>
        The A1 Lithuanian Language Integration Test is required by most foreigners renewing their Lithuanian residence permit. Fee is around <strong>€52</strong> (2026), and you need <strong>50% overall</strong> with a minimum of 25% in each section to pass. KalbaLab covers all four sections: reading, writing, listening, and speaking.
      </>
    ),
  },
  {
    q: "Which languages do you support?",
    aText:
      "The interface is available in 7 languages: English, Bengali, Azerbaijani, Hindi, Kyrgyz, Tajik, and Uzbek. You can switch any time from the language picker in the header.",
    a: (
      <>
        The interface is available in <strong>7 languages</strong>: English, Bengali (বাংলা), Azerbaijani (Azərbaycanca), Hindi (हिन्दी), Kyrgyz (Кыргызча), Tajik (Тоҷикӣ), and Uzbek (Oʻzbekcha). You can switch any time from the language picker in the header.
      </>
    ),
  },
  {
    q: "How is the audio so accurate?",
    aText:
      "We use server-side text-to-speech with native Lithuanian voices instead of the browser's default. That way you hear correct pronunciation of letters like š, ž, ė, ą, and ų regardless of your device.",
    a: (
      <>
        We use server-side text-to-speech with native Lithuanian voices instead of relying on whatever your browser has installed. That way you hear correct pronunciation of letters like <em>š</em>, <em>ž</em>, <em>ė</em>, <em>ą</em>, and <em>ų</em> regardless of your device.
      </>
    ),
  },
  {
    q: "Do I need an account?",
    aText:
      "You can browse vocabulary, flashcards, and lessons without signing in. An account is only needed to save progress, track your streak, and earn XP. Sign up takes 30 seconds — name, email, password — or use your Google account.",
    a: (
      <>You can browse vocabulary, flashcards, and lessons without signing in. An account is only needed to save progress, track your streak, and earn XP. Sign up takes 30 seconds — name, email, password — or use your Google account.</>
    ),
  },
  {
    q: "When will A2 and B1 levels be available?",
    aText:
      "We're focusing on making A1 perfect first since that's what most learners need for residency. A2 and B1 are on the roadmap and you'll see them light up automatically once content is ready.",
    a: (
      <>We&apos;re focusing on making A1 perfect first since that&apos;s what most learners need for residency. A2 and B1 are on the roadmap and you&apos;ll see them light up automatically once content is ready.</>
    ),
  },
  {
    q: "Is my data safe?",
    aText:
      "We only store what we need: your name, email, and learning progress. We don't sell or share data with third parties. See our Privacy Policy for the full breakdown.",
    a: (
      <>
        We only store what we need: your name, email, and learning progress. We don&apos;t sell or share data with third parties. See our{" "}
        <a href="/privacy" className="text-amber-400 hover:text-amber-300 font-medium">Privacy Policy</a> for the full breakdown.
      </>
    ),
  },
  {
    q: "Can I contribute translations or report a mistake?",
    aText:
      "Yes! Email us at armansalekofficial@gmail.com with the word, lesson, or feature you'd like to improve.",
    a: (
      <>
        Yes! We&apos;d love that. Email us at{" "}
        <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300 font-medium">armansalekofficial@gmail.com</a>{" "}
        with the word, lesson, or feature you&apos;d like to improve.
      </>
    ),
  },
  {
    q: "Does it work on mobile?",
    aText:
      "Yes — KalbaLab is fully responsive on phones and tablets. There's no app to install; just bookmark the site or add it to your home screen.",
    a: (
      <>Yes — KalbaLab is fully responsive on phones and tablets. There&apos;s no app to install; just bookmark the site or add it to your home screen.</>
    ),
  },
  {
    q: "I'm stuck — how do I get help?",
    aText:
      "Reach out via the contact page or email armansalekofficial@gmail.com. We try to respond within 1–2 days.",
    a: (
      <>
        Reach out via the{" "}
        <a href="/contact" className="text-amber-400 hover:text-amber-300 font-medium">contact page</a>{" "}
        or email{" "}
        <a href="mailto:armansalekofficial@gmail.com" className="text-amber-400 hover:text-amber-300 font-medium">armansalekofficial@gmail.com</a>. We try to respond within 1–2 days.
      </>
    ),
  },
];
