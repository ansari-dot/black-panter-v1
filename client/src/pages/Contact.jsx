import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ContactHeroSection";
import ContactSection from "../components/contact";
import Footer from "../components/Footer";
import contactHeroImage from '../assets/herosections/contact.webp';
export const Contact = () => {
  return (
    <PageLayout 
      heroContent={<HeroSection />}
      vectorBackground={contactHeroImage}
    >
      <ContactSection />
      <Footer />
    </PageLayout>
  );
};
