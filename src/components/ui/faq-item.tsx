"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Background highlight on open */}
      <motion.div
        className="absolute inset-0 bg-accent/[0.08] rounded-2xl -mx-4 px-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={
          isOpen
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.98 }
        }
        transition={{ duration: 0.2 }}
      />
      <div className="relative border-b border-text-primary/[0.12]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-5 py-5 text-left group cursor-pointer"
          aria-expanded={isOpen}
        >
          {/* Animated +/x icon */}
          <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{
                duration: 0.3,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="absolute w-5 h-[2px] rounded-full bg-text-primary/60"
            />
            <motion.span
              animate={{ rotate: isOpen ? 45 : 90 }}
              transition={{
                duration: 0.3,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="absolute w-[2px] h-5 rounded-full bg-text-primary/60"
            />
          </div>
          <span className="text-lg font-extrabold text-text-primary">
            {question}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="overflow-hidden"
            >
              <p className="pb-5 pl-10 text-text-secondary leading-relaxed">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
