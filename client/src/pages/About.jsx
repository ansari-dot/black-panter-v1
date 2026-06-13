import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/AboutHeroSection";
import OurMissionSection from "../components/OurMission";
import Footer from "../components/Footer";
import WhoSection from "../components/WhoSection";
import WhyChooseUsSection from "../components/WhyChoose";
import TeamSection from "../components/Team";
import Testimonals from "../components/TestiomonialsSection";
import TestimonialsSection from "../components/Testimonials";
import CTA from "../components/CTA";
import aboutHeroImage from '../assets/herosections/about.webp';
export const About = () => {
  return (
    <PageLayout 
      heroContent={<HeroSection />}
      vectorBackground={aboutHeroImage}
    >
      <div className="mt-16">
        <OurMissionSection />
      </div>
      <WhoSection />
      <WhyChooseUsSection />
      <TeamSection />
      <Testimonals />
      <TestimonialsSection />
      <CTA />
     
      <Footer />
    </PageLayout>
  );
};
