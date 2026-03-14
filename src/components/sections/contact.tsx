"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sendContactEmail } from "@/actions/contact";
import { AnimatedSection } from "@/components/ui/animated-section";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t("errors.nameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("errors.emailInvalid");
    if (!formData.subject.trim())
      newErrors.subject = t("errors.subjectRequired");
    if (formData.message.trim().length < 10)
      newErrors.message = t("errors.messageRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  return (
    <section id="contact" className="relative py-40 scroll-mt-20">
      <div className="mx-auto max-w-2xl px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg text-text-secondary md:text-xl">{t("subtitle")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border-custom bg-surface p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  {t("name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border-custom bg-background px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border-custom bg-background px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                {t("subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-border-custom bg-background px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                {t("message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-border-custom bg-background px-4 py-3 text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-accent py-3.5 font-medium text-white transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "loading" ? t("sending") : t("send")}
            </button>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-emerald-400"
              >
                {t("success")}
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-red-400"
              >
                {t("error")}
              </motion.p>
            )}
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
