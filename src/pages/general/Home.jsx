import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import StatsSection from "./StatsSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
function Home() {
  return (
    <div className="bg-white dark:bg-gray-950">

      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <ContactSection />

    </div>
  );
}

export default Home;