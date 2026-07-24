import React from "react";
import { useParams } from "react-router-dom";
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

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { services, isLoading } = useServiceCatalog();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-slate-500">
        Loading service details...
      </div>
    );
  }

  const service = services.find((s) => s.slug === slug) || services[0];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-slate-500">
        Service not found
      </div>
    );
  }

  return (
    <PageLayout 
      heroContent={<HeroSection 
        badge={service.title}
        title={service.heroTitle || service.title}
        description={service.heroDescription || service.description}
      />}
      vectorBackground={serviceDetailHeroImage}
    >
      <Critcial service={service} />
      <Technical service={service} />
      <RecentProject />
      <Team />
      <TestimonialsCards />
      <CTASection />
      <IndustriesWeServe />
      <Footer />
    </PageLayout>
  );
};
