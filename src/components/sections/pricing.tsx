"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Pricing() {
  const t = useTranslations("pricing");
  const [isYearly, setIsYearly] = useState(false);

  const freeFeatures = t.raw("free.features") as string[];
  const premiumFeatures = t.raw("premium.features") as string[];

  return (
    <section id="pricing" className="relative py-16 lg:py-24 scroll-mt-20">
      <div className="mx-auto max-w-[900px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.02em]">
            {t("title")}
            <span className="text-text-muted font-medium text-[0.6em] block mt-1">
              {t("subtitle")}
            </span>
          </h2>

          {/* Toggle */}
          {/* <div className="mt-6 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium transition-colors ${!isYearly ? "text-text-primary" : "text-text-muted"}`}
            >
              {t("monthly")}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${
                isYearly ? "bg-accent" : "bg-surface-hover"
              }`}
              aria-label="Toggle yearly pricing"
            >
              <motion.div
                animate={{ x: isYearly ? 22 : 2 }}
                transition={{ duration: 0.2 }}
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${isYearly ? "text-text-primary" : "text-text-muted"}`}
            >
              {t("yearly")}
            </span>
          </div> */}
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-text-primary/10 p-6 md:p-8"
          >
            <h3 className="font-extrabold text-xl mb-1">
              {t("free.name")}
            </h3>
            <p className="text-text-muted text-sm">
              {t("free.description")}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-black text-4xl">
                {t("free.price")}€
              </span>
              <span className="text-text-muted text-sm">
                {(t.raw("monthly") as string).toLowerCase()}
              </span>
            </div>

            <ul className="mt-6 space-y-3">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-text-primary/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-text-secondary font-medium text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative rounded-2xl border-2 border-accent/30 p-6 md:p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(139, 92, 246, 0.12))",
            }}
          >
            {/* Badge */}
            <span className="absolute top-0 right-6 -translate-y-1/2 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {t("premium.badge")}
            </span>

            <h3 className="font-extrabold text-xl mb-1">
              {t("premium.name")}
            </h3>
            <p className="text-text-muted text-sm">
              {t("premium.description")}
            </p>

            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-black text-4xl">
                  {isYearly
                    ? t("premium.yearlyPrice")
                    : t("premium.monthlyPrice")}
                  €
                </span>
                <span className="text-text-muted text-sm">
                  {isYearly
                    ? (t.raw("yearly") as string).toLowerCase()
                    : (t.raw("monthly") as string).toLowerCase()}
                </span>
              </div>
              {isYearly && (
                <p className="mt-1.5 text-sm text-accent-light font-medium">
                  {t("premium.yearlySaving")}
                </p>
              )}
            </div>

            <p className="mt-6 text-text-muted text-xs font-medium uppercase tracking-wide">
              {t("premium.includes")}
            </p>

            <ul className="mt-3 space-y-3">
              {premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-text-secondary font-medium text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
