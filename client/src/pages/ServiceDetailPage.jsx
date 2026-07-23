import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, CheckCircle2Icon, ShieldIcon, ActivityIcon, SettingsIcon, ShieldCheckIcon, ZapIcon, ChevronLeftIcon, PhoneIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ServiceDetailHeroSection";
import Footer from "../components/Footer";
import { useServiceCatalog } from "../hooks/useServiceCatalog";
import serviceDetailHeroImage from '../assets/herosections/servicedetails.webp';
import * as FaIcons from 'react-icons/fa';

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { services } = useServiceCatalog();
  const service = services.find((item) => item.slug === slug) || services[0];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!service) {
    return <div className="p-8 text-center font-sans text-slate-500">Service not found</div>;
  }

  // Filter gallery images and remove old unrelated placeholder URLs
  const rawGallery = (service.gallery || []).filter(img => img && typeof img === 'string' && !img.includes('banani-generated-images'));
  const galleryImages = rawGallery.length > 0 ? rawGallery : [service.detailImageUrl, service.imageUrl].filter(Boolean);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const heroContent = (
    <HeroSection
      badge={service.title}
      title={service.heroTitle}
      description={service.heroDescription}
      primaryButtonText="Get a Quote"
      secondaryButtonText="View All Services"
    />
  );

  // Helper to clean quotes and commas from key highlights strings
  const cleanText = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/^["'\s]+|["'\s,]+$/g, '').trim();
  };

  // Helper to render dynamic Fa icons
  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    if (Icon) return <Icon />;
    return <SettingsIcon />;
  };

  return (
    <div className="bg-white color-slate-900 font-sans select-none">
      <PageLayout heroContent={heroContent} vectorBackground={serviceDetailHeroImage}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 py-10 md:py-20">
          
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            
            {/* Left Content Area (2 Cols on Desktop) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F06123]">
                  About the Service
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mt-2 mb-4">
                  {service.criticalPowerTitle || service.title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                  {service.criticalPowerDescription || service.description}
                </p>
              </div>

              {/* Gallery Image Slider */}
              {galleryImages.length > 0 && (
                <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-100 group mt-4">
                  <div 
                    className="flex w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="min-w-full h-full relative shrink-0">
                        <img src={img} alt={`${service.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Slider Controls */}
                  {galleryImages.length > 1 && (
                    <>
                      <button 
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md hover:bg-[#F06123] hover:text-white transition-all cursor-pointer z-10"
                        onClick={prevImage}
                      >
                        <ChevronLeftIcon size={20} />
                      </button>
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md hover:bg-[#F06123] hover:text-white transition-all cursor-pointer z-10"
                        onClick={nextImage}
                      >
                        <ChevronRightIcon size={20} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {galleryImages.map((_, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-6 bg-[#F06123]' : 'w-2 bg-white/70'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              
              {/* Key Highlights Card */}
              {service.keyHighlights && service.keyHighlights.length > 0 && (
                <div className="bg-[#fcfaf7] border border-orange-100/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Key Highlights</h3>
                  <ul className="flex flex-col gap-3 p-0 m-0 list-none">
                    {service.keyHighlights.map((highlight, index) => {
                      const cleanItem = cleanText(highlight);
                      if (!cleanItem) return null;
                      return (
                        <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-snug">
                          <CheckCircle2Icon size={16} className="text-[#F06123] shrink-0 mt-0.5" />
                          <span>{cleanItem}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Certification Badge */}
              {(service.certificationTitle || service.certificationDescription) && (
                <div className="bg-white border border-[#F06123]/30 rounded-2xl p-6 shadow-sm">
                  {service.certificationTitle && (
                    <h3 className="text-base font-bold text-[#F06123] mb-2">{service.certificationTitle}</h3>
                  )}
                  {service.certificationDescription && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.certificationDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Schedule Service CTA Button */}
              <Link 
                to="/contact" 
                className="w-full bg-[#F06123] hover:bg-[#FF8803] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#F06123]/20"
              >
                Schedule Service
                <ArrowRightIcon size={18} />
              </Link>

              {/* Australian Standards Compliant Box */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-[#F06123] flex items-center justify-center text-white shadow-sm">
                  <ShieldCheckIcon size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Australian Standards Compliant</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  All maintenance programs meet or exceed Australian reliability and safety standards.
                </p>
              </div>

            </div>
          </div>

          {/* Technical Procedures Section */}
          {service.technicalProcedures && service.technicalProcedures.length > 0 && (
            <div className="mt-16 md:mt-24 pt-12 border-t border-slate-100">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F06123]">
                  Our Expertise
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-2">
                  Technical Procedures
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
                  From installation to preventive maintenance, we manage the entire lifecycle of your industrial power systems.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.technicalProcedures.map((proc, idx) => (
                  <div 
                    key={proc.title || idx} 
                    className="bg-white border border-slate-100 hover:border-[#F06123] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F06123] group-hover:bg-[#F06123] group-hover:text-white flex items-center justify-center text-xl transition-colors">
                      {renderIcon(proc.icon)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#F06123] transition-colors">
                        {proc.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {proc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency 24/7 Support Banner */}
          <div className="mt-16 md:mt-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 md:p-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF8803]">
                {service.emergencyTitle || "24/7 Emergency Support"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-3">
                Need Immediate Support?
              </h3>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
                {service.emergencyDescription || "Contact our round-the-clock emergency team for fast dispatch and on-site industrial battery repair."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link 
                to="/contact" 
                className="bg-[#F06123] hover:bg-[#FF8803] text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <FaIcons.FaPhoneAlt className="text-xs" />
                Contact 24/7 Hotline
              </Link>
              <Link 
                to="/services" 
                className="border border-white/20 hover:bg-white/10 text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-center"
              >
                <ArrowLeftIcon size={16} />
                Explore Other Services
              </Link>
            </div>
          </div>

        </div>
        <Footer />
      </PageLayout>
    </div>
  );
};
