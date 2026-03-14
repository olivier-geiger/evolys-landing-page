import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { DownloadCta } from "@/components/sections/download-cta";
import { SplashScreen } from "@/components/ui/splash-screen";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export default function Home() {
  return (
    <SplashScreen>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Faq />
        <Contact />
        <DownloadCta />
      </main>
      <Footer />
    </SplashScreen>
  );
}
