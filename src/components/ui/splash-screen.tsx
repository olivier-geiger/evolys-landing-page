"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import Image from "next/image";

const SplashContext = createContext(false);

export function useSplashDone() {
  return useContext(SplashContext);
}

interface SplashScreenProps {
  children: React.ReactNode;
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [phase, setPhase] = useState<
    "icon" | "glow" | "text" | "hold" | "exiting" | "done"
  >("icon");

  const splashDone = phase === "exiting" || phase === "done";

  useEffect(() => {
    const glowTimer = setTimeout(() => setPhase("glow"), 600);
    const textTimer = setTimeout(() => setPhase("text"), 1100);
    const holdTimer = setTimeout(() => setPhase("hold"), 1800);
    const exitTimer = setTimeout(() => setPhase("exiting"), 2300);
    const doneTimer = setTimeout(() => setPhase("done"), 3000);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(textTimer);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const letters = "Evolys".split("");
  const showText = phase === "text" || phase === "hold" || phase === "exiting";

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            initial={{ y: 0 }}
            animate={phase === "exiting" ? { y: "-100%" } : { y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          >
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    phase !== "icon"
                      ? {
                          opacity: [0, 0.6, 0.3],
                          scale: [0.8, 1.8, 1.4],
                        }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 rounded-3xl bg-accent/40 blur-2xl"
                />
                <Image
                  src="/icon.png"
                  alt="Evolys"
                  width={72}
                  height={72}
                  className="relative rounded-2xl"
                  priority
                />
              </motion.div>

              <div className="flex overflow-hidden">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
                    animate={
                      showText
                        ? { opacity: 1, x: 0, filter: "blur(0px)" }
                        : { opacity: 0, x: -8, filter: "blur(4px)" }
                    }
                    transition={{
                      duration: 0.3,
                      delay: showText ? i * 0.06 : 0,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="text-5xl md:text-7xl font-extrabold text-text-primary"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SplashContext.Provider value={splashDone}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={splashDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: splashDone ? 0.2 : 0 }}
        >
          {children}
        </motion.div>
      </SplashContext.Provider>
    </>
  );
}
