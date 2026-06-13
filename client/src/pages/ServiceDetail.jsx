import React from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ServiceDetailHeroSection";
import Critcial from "../components/Critcial";
import Technical from "../components/Techincal";
import RecentProject from "../components/RecentProject";
import Team from "../components/Team";
import TestimonialsSection from "../components/TestiomonialsSection";
import TestimonialsCards from "../components/Testimonials";
import CTASection from "../components/CTA";
import IndustriesWeServe from "../components/IndustryServe";
import Footer from "../components/Footer";
import { useServiceCatalog } from "../hooks/useServiceCatalog";
import serviceDetailHeroImage from '../assets/herosections/servicedetails.webp';

export const ServiceDetail = () => {
  const { activeServices } = useServiceCatalog();
  const service = activeServices[0];

  return (
    <PageLayout 
      heroContent={<HeroSection
        badge={service?.heroBadge || "Detailed Service Information"}
        title={service?.heroTitle || {
          line1: { white: "Expert ", orange: "Solutions" },
          line2: { white: "Tailored for ", orange: "You" }
        }}
        description={service?.heroDescription || "Discover our specialized battery services designed to maximize performance, extend battery life, and ensure uninterrupted power for your critical operations."}
      />}
      vectorBackground={serviceDetailHeroImage}
    >
      <Critcial service={service} />
      <Technical service={service} />
      <RecentProject />
      <Team />
      <TestimonialsSection />
      <TestimonialsCards />
      <CTASection />
      <IndustriesWeServe />
      <Footer />
     </PageLayout>
  );
};
