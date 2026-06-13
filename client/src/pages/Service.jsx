import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ServiceHeroSection";
import ServicesSection from "../components/ServicesSection";
import Equipment from '../components/Equpiment'
import WhyChooseUsSection from "../components/WhyChoose";
import RecentProjects from "../components/RecentProject";
import Team from '../components/Team'
import TestimonialsCards from "../components/Testimonials";
import TestimonialsSection from "../components/TestiomonialsSection";
import CTASection from "../components/CTA";
import IndustriesWeServe from "../components/IndustryServe";
import Footer from "../components/Footer";
import servicesHeroImage from '../assets/herosections/services.webp';
export const Service = () => {
  return (
    <PageLayout 
      heroContent={<HeroSection />}
      vectorBackground={servicesHeroImage}
    >
      <ServicesSection />
      <Equipment />
      <WhyChooseUsSection />
      <Team />
      <TestimonialsSection />
      <TestimonialsCards />
      <CTASection />
      <IndustriesWeServe />
      <Footer />
    </PageLayout>
  );
};
