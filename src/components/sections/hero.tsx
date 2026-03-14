"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useSplashDone } from "@/components/ui/splash-screen";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function AppStoreButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);
  const smooth = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex transform-gpu items-center overflow-hidden rounded-xl sm:rounded-2xl bg-[#F7F2ED] px-4 py-2 sm:px-5 sm:py-2.5 cursor-pointer select-none no-underline transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(57,55,55,0.2),0_0_24px_rgba(139,92,246,0.25)]"
      style={{
        boxShadow: "rgba(26, 21, 18, 0.18) 0px 4px 20px",
        willChange: "transform, box-shadow",
      }}
    >
      <span className="flex items-center">
        {/* Icon slot — Apple logo or Arrow */}
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
          {/* Apple icon */}
          <motion.span
            initial={{ opacity: 1, scale: 1 }}
            animate={hovered ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            transition={smooth}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="h-8 sm:h-10 w-auto text-[#393737]"
              viewBox="4 0 21 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </motion.span>
          {/* Arrow */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={smooth}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8 text-[#393737]"
              viewBox="-4 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </motion.span>
        </span>

        {/* Text */}
        <div className="ml-1.5 sm:ml-2 flex flex-col leading-tight">
          <span className="text-[10px] sm:text-[12px] font-medium text-[#393737]/70 tracking-[0.01em]">
            Download on the
          </span>
          <span className="text-[19px] sm:text-[24px] font-semibold text-[#393737] tracking-[-0.01em] -mt-[3px] sm:-mt-[4px]">
            App Store
          </span>
        </div>
      </span>
    </motion.a>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const ready = useSplashDone();

  return (
    <section className="relative overflow-hidden">
      {/* Background glow — fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-accent/8 blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        {/* App icon with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={
            ready
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.5, y: 20 }
          }
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mb-10"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 rounded-3xl bg-accent/20 blur-xl scale-125"
            />
            <Image
              src="/icon.png"
              alt="Evolys"
              width={96}
              height={96}
              className="relative rounded-3xl shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="mx-auto max-w-5xl text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.08] tracking-tight"
        >
          {t("title")}{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="font-display italic text-accent-light"
          >
            {t("titleAccent")}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="mx-auto mt-10 max-w-xl text-lg text-text-secondary leading-relaxed md:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-12"
        >
          <AppStoreButton href="https://apps.apple.com/fr/app/votre-suivi-evolys/id6754026468" />
        </motion.div>

        {/* Scroll to preview indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-text-secondary/60">
            Scroll to preview
          </span>
          <motion.svg
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-text-secondary/40"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Preview image with glow shadow */}
      <div className="relative z-10 mx-auto px-6 pb-32 flex justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={
            ready
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 80, scale: 0.95 }
          }
          transition={{ duration: 1, delay: 0.9, ease }}
          className="relative"
          style={{ width: "min(90vw, 750px)" }}
        >
          <Image
            src="/image.png"
            alt="Evolys app preview"
            width={600}
            height={1300}
            className="relative mx-auto w-full object-contain"
            priority
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  );
}
