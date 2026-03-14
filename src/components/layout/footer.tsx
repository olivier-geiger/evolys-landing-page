"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-custom bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Evolys"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-text-primary">Evolys</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t("privacy")}
            </Link>
            <a
              href="#contact"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t("contact")}
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-text-muted">
          <p>
            &copy; {new Date().getFullYear()} Evolys. {t("rights")}
          </p>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://okorp.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors"
            >
              Okorp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
