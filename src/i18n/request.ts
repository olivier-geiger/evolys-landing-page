import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, type Locale, locales } from "./config";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

const messages = { en, fr } as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  let locale: Locale = defaultLocale;

  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    const acceptLanguage = headerStore.get("accept-language") || "";
    const browserLang = acceptLanguage.split(",")[0]?.split("-")[0];
    if (browserLang && locales.includes(browserLang as Locale)) {
      locale = browserLang as Locale;
    }
  }

  return {
    locale,
    messages: messages[locale],
  };
});
