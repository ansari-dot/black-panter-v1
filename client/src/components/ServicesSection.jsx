import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Zap,
  Recycle,
  Activity,
  ShieldCheck,
  AlarmClock,
  ArrowRight,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  recycle: Recycle,
  activity: Activity,
  "shield-check": ShieldCheck,
  "alarm-clock": AlarmClock,
  battery: Wrench,
  default: Wrench,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || iconMap.default;
  return IconComponent;
};

export default function ServicesSection() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const mobileSliderRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/services?featuredOnHome=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data
            .filter((s) => s.status === "Active")
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setServices(active);
        }
      })
      .catch(() => { });
  }, []);

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const scrollLeft = mobileSliderRef.current.scrollLeft;
    const width = mobileSliderRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveMobileSlide(newIndex);
  };

  const scrollToMobileSlide = (index) => {
    if (!mobileSliderRef.current) return;
    const width = mobileSliderRef.current.offsetWidth;
    mobileSliderRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveMobileSlide(index);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API}${imageUrl}`;
  };

  const defaultImages = [
    "https://storage.googleapis.com/banani-generated-images/generated-images/ef1a733e-f432-4df7-9a24-1b66b2bc3ebb.jpg",
    "https://storage.googleapis.com/banani-generated-images/generated-images/25bd57a3-2c71-4208-8f64-db46228ec478.jpg",
    "https://storage.googleapis.com/banani-generated-images/generated-images/14d2aed3-d701-4017-ae7a-932b5befb291.jpg",
    "https://storage.googleapis.com/banani-generated-images/generated-images/18faaae3-fe37-4396-abd8-4f02b7a68912.jpg",
    "https://storage.googleapis.com/banani-generated-images/generated-images/0ea4cf40-cbed-4abd-a47b-b5baf1e0b36d.jpg",
    "https://storage.googleapis.com/banani-generated-images/generated-images/e4d8ca25-4759-43ba-a1d1-a3c4478d0d68.jpg",
  ];

  if (!services.length) return null;

  return (
    <section className="w-full relative overflow-hidden bg-[#f6f1ea] py-12 md:py-24 px-4 sm:px-8 md:px-16 font-sans select-none">
      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <div className="flex items-center gap-3 text-[#e85a1f] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="block w-8 h-[2px] bg-[#e85a1f] opacity-60" />
            Our Services
            <span className="block w-8 h-[2px] bg-[#e85a1f] opacity-60" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#181615] tracking-tight leading-tight mb-3">
            Industrial Battery Services
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Professional maintenance, testing, and rebuild services engineered for maximum power reliability.
          </p>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with swipe */}
        <div className="block md:hidden">
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 -mx-4 px-5 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {services.map((service, index) => (
              <div key={service._id || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <ServiceCard
                  service={service}
                  index={index}
                  navigate={navigate}
                  getImageUrl={getImageUrl}
                  defaultImages={defaultImages}
                />
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          {services.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToMobileSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeMobileSlide === i ? "w-6 bg-[#e85a1f]" : "w-2 bg-slate-300"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP GRID (>= 768px): 3-Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 w-full">
          {services.map((service, index) => (
            <ServiceCard
              key={service._id || index}
              service={service}
              index={index}
              navigate={navigate}
              getImageUrl={getImageUrl}
              defaultImages={defaultImages}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

import { getServiceCardIcon } from "../utils/serviceCatalog";

function ServiceCard({ service, index, navigate, getImageUrl, defaultImages }) {
  const IconComponent = getServiceCardIcon(service.iconName, service.title);
  const imageUrl = getImageUrl(service.imageUrl) || defaultImages[index % defaultImages.length];
  const isFeatured = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-[24px] h-[340px] flex items-end border border-[#e7ddd1] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer w-full"
      onClick={() => navigate(`/service/${service.slug}`)}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: isFeatured
            ? "linear-gradient(180deg, rgba(24, 22, 21, 0.1) 0%, rgba(24, 22, 21, 0.4) 40%, rgba(24, 22, 21, 0.92) 100%)"
            : "linear-gradient(180deg, rgba(24, 22, 21, 0.1) 0%, rgba(24, 22, 21, 0.4) 40%, rgba(24, 22, 21, 0.95) 100%)",
        }}
      />

      {/* Icon Badge & Index */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm">
          <IconComponent size={20} className="text-[#e85a1f]" />
        </div>
        <span className="text-xs font-extrabold text-white/90 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full p-6 flex flex-col gap-2">
        <h3 className="text-xl font-extrabold text-white leading-tight">
          {service.title}
        </h3>
        <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed">
          {service.heroDescription || service.description}
        </p>

        {/* Highlights */}
        {service.keyHighlights && service.keyHighlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {service.keyHighlights.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Learn More */}
        <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#FF8803] group-hover:text-white transition-colors">
          <span>Learn More</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}