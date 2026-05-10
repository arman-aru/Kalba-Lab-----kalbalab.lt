import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SEO } from "@/components/seo/SEO";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
import { SITE, abs } from "@/lib/seo/site";
import { vocabularyData } from "@/data/vocabulary";
import { dialoguesData } from "@/data/dialogues";
import { grammarTopics } from "@/data/grammar";
import { LANGUAGES } from "@/lib/i18n";

// Compute the home stats from the actual data modules at build time so we
// never display numbers that disagree with what the user finds inside the app.
const HOME_COUNTS = {
  words: vocabularyData.length,
  lessons: dialoguesData.length + grammarTopics.length,
  languages: LANGUAGES.length,
};

export const metadata: Metadata = buildMetadata({
  title: "KalbaLab — Learn Lithuanian, in your language",
  description:
    "Learn Lithuanian with native audio, multilingual explanations (Bengali, Hindi, Urdu, Uzbek, Tajik, Kyrgyz, Azerbaijani, Arabic, Turkish, English) and complete A1 integration-exam preparation.",
  path: "/",
  type: "website",
  // No explicit image — buildMetadata falls back to the site-wide
  // /social-share-kalbalab.png defined in lib/seo/metadata.ts.
});

const HOME_FAQ = [
  {
    question: "Is KalbaLab free to use?",
    answer:
      "Yes. The full vocabulary, flashcards, lessons, and A1 exam preparation are free to use. Create an account to track progress and earn XP.",
  },
  {
    question: "Which native languages does KalbaLab support for explanations?",
    answer:
      "English, Bengali, Hindi, Urdu, Uzbek, Tajik, Kyrgyz, Azerbaijani, Arabic, and Turkish. Lithuanian itself is the target language.",
  },
  {
    question: "Does KalbaLab help with the Lithuanian A1 integration exam?",
    answer:
      "Yes. The Exam Prep module covers all four sections — reading, writing, listening, and speaking — using the official A1 format and a 50% pass threshold.",
  },
  {
    question: "How much does the A1 Lithuanian state exam cost?",
    answer:
      "As of 2025 the official fee is €52, paid to the National Examination Centre (NEC). KalbaLab itself does not administer the exam.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SEO
        blocks={[
          breadcrumbLd([
            { name: "Home", url: SITE.url },
          ]),
          faqLd([...HOME_FAQ]),
          // Most-asked-about thing on the home page is the A1 exam — emit a HowTo
          // so AI engines have a structured answer to "how do I pass the Lithuanian A1 exam".
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to prepare for the Lithuanian A1 integration exam",
            description:
              "A four-step preparation path covering reading, writing, listening, and speaking, used by KalbaLab learners in Lithuania.",
            totalTime: "PT40H",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Build core A1 vocabulary",
                text: "Learn the ~200 highest-frequency Lithuanian A1 words with native audio and your own language as the explanation key.",
                url: abs("/vocabulary"),
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Drill with spaced-repetition flashcards",
                text: "Use the flashcard system to lock vocabulary into long-term memory. The deck adapts to what you forget.",
                url: abs("/flashcards"),
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Work through the structured A1 lessons",
                text: "Cover greetings, pronouns, the seven cases (genitive priority for A1), present tense, numbers, time, and questions.",
                url: abs("/lessons"),
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Take the mock A1 exam",
                text: "Run the timed mock exam covering reading, writing, listening, and speaking under official conditions.",
                url: abs("/exam-prep"),
              },
            ],
          },
        ]}
      />
      <HomeClient counts={HOME_COUNTS} />
    </>
  );
}
