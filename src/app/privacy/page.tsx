import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: `${t("title")} — Evolys` };
}

interface LegalSection {
  title: string;
  text: string;
  list?: string[];
  extra?: string;
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border-custom">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface text-text-secondary hover:bg-surface-hover transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Evolys"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-text-primary">Evolys</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          {t("title")}
        </h1>
        <p className="text-sm text-text-muted mb-12">{t("lastUpdated")}</p>

        <div className="space-y-10">
          <p className="text-text-secondary leading-relaxed">{t("intro")}</p>

          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-text-primary mb-3">
                {section.title}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {section.text}
              </p>
              {section.list && (
                <ul className="mt-3 list-disc pl-6 space-y-2 text-text-secondary">
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {section.extra && (
                <p className="mt-3 text-text-secondary leading-relaxed">
                  {section.extra}
                </p>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-border-custom bg-surface/50">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} Evolys</p>
        </div>
      </footer>
    </div>
  );
}
