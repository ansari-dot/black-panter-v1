import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ServiceHeroSection";
import ServicesSection from "../components/ServicesSection";
import Equipment from '../components/Equpiment'
import WhyChooseUsSection from "../components/WhyChoose";
import RecentProjects from "../components/RecentProject";
import Team from '../components/Team';
import TestimonialsSection from "../components/TestiomonialsSection";
import TestimonialsCards from "../components/Testimonials";
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
      <TestimonialsCards />
      <CTASection />
      <IndustriesWeServe />
      <Footer />
    </PageLayout>
  );
};
