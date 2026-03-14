import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evolys.netlify.app"),
  title: "Evolys — Your habits, no pressure",
  description:
    "Build lasting habits with simple tracking, motivating streaks, and a kind approach. No account needed. Synced across all your Apple devices.",
  keywords: [
    "habit tracker",
    "habit app",
    "routine tracker",
    "iOS app",
    "productivity",
    "Evolys",
    "streaks",
  ],
  authors: [{ name: "Carolane Lefebvre" }],
  openGraph: {
    title: "Evolys — Your habits, no pressure",
    description:
      "Build lasting habits with simple tracking and motivating streaks. No account needed.",
    url: "https://evolys.netlify.app",
    siteName: "Evolys",
    images: [{ url: "/preview.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolys — Your habits, no pressure",
    description:
      "Build lasting habits with simple tracking and motivating streaks. No account needed.",
    images: ["/preview.png"],
  },
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/icon.png?v=2",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8722af36-3f7e-4890-9bef-d39dd33864b9"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Evolys",
                  url: "https://evolys.netlify.app",
                  description: "Build lasting habits with simple tracking, motivating streaks, and a kind approach. No account needed.",
                  inLanguage: ["en", "fr"],
                  publisher: { "@type": "Organization", name: "Evolys" },
                },
                {
                  "@type": "MobileApplication",
                  name: "Evolys - Your habits, no pressure",
                  applicationCategory: "HealthApplication",
                  operatingSystem: "iOS",
                  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
                  url: "https://apps.apple.com/fr/app/votre-suivi-evolys/id6754026468",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
