import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { SensorsSection } from "@/components/home/sensors-section"
import { FaqSection } from "@/components/home/faq-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SensorsSection />
      <FaqSection />
    </>
  )
}
