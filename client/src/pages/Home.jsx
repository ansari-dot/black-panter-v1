import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/HomeHeroSection";
import ServicesSection from "../components/ServicesSection";
import IndustrySection from "../components/IndustrySection";
import RecentProjects from "../components/RecentProject";
import Team from '../components/Team'
import TestimonialsSection from "../components/Testimonials";
import CTASection from "../components/CTA";
import IndustryServe from '../components/IndustryServe'
import Footer from '../components/Footer'
import homeHeroImage from '../assets/herosections/home.webp';
export const Home = () => {
  const backgroundImage = homeHeroImage;

  return (
    <PageLayout 
      heroContent={<HeroSection />}
      vectorBackground={backgroundImage}
    >
      <IndustrySection />
       <ServicesSection />
       <RecentProjects />
       <Team
         title="Meet Our Experts"
         subtitle="Certified engineers and technicians dedicated to your power reliability."
       />
       <TestimonialsSection />
       <CTASection />
       <IndustryServe />
       <Footer />
    </PageLayout>
  );
};
