"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import { useSplashDone } from "@/components/ui/splash-screen";

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const ready = useSplashDone();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const switchLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleCookie(newLocale);
      window.location.reload();
    });
  };

  const navLinks = [
    { href: "#features", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "#faq", label: t("faq") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-b border-border-custom shadow-lg shadow-black/5"
          : "bg-background/60"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <Image
              src="/icon.png"
              alt="Evolys"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-text-primary">Evolys</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => switchLocale(locale === "en" ? "fr" : "en")}
              className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Switch language"
            >
              {locale === "en" ? "FR" : "EN"}
            </button>

            <a
              href="https://apps.apple.com/fr/app/votre-suivi-evolys/id6754026468"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
            >
              {t("download")}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-text-primary"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-text-primary"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-text-primary"
            />
          </button>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={
            mobileOpen
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden"
        >
          <div className="flex flex-col gap-4 pt-6 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => switchLocale(locale === "en" ? "fr" : "en")}
                className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {locale === "en" ? "FR" : "EN"}
              </button>
              <a
                href="https://apps.apple.com/fr/app/votre-suivi-evolys/id6754026468"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white"
              >
                {t("download")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
