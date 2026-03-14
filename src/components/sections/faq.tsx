"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaqItem } from "@/components/ui/faq-item";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{ question: string; answer: string }>;

  return (
    <section id="faq" className="relative pt-2 pb-6 lg:pt-14 scroll-mt-20">
      <div className="mx-auto max-w-[720px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.02em]">
            {t("title")}
          </h2>
        </motion.div>

        <div className="space-y-0">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <FaqItem question={item.question} answer={item.answer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
