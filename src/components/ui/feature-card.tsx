"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function FeatureCard({
  icon,
  title,
  description,
  isActive,
  onClick,
}: FeatureCardProps) {
  return (
    <motion.button
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      whileHover={{ y: -4 }}
      className={`group relative w-full rounded-2xl border p-6 text-left transition-all duration-300 cursor-pointer ${
        isActive
          ? "border-accent/40 bg-accent-glow shadow-lg shadow-accent/10"
          : "border-border-custom bg-surface hover:border-border-hover hover:bg-surface-hover"
      }`}
      aria-pressed={isActive}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
          isActive
            ? "bg-accent text-white"
            : "bg-accent/10 text-accent group-hover:bg-accent/20"
        }`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </motion.button>
  );
}
