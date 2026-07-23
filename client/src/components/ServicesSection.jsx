import React, { useEffect, useState } from "react";
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
  Phone,
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      .catch(() => {});

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardVariants = {
    initial: { y: 60, opacity: 0, scale: 0.95 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
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
    <section
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: "#f6f1ea",
        padding: isMobile ? "60px 16px 80px" : "72px 72px 96px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Ambient Orbs */}
      <div
        className="absolute rounded-full opacity-95 hidden md:block"
        style={{
          width: "220px",
          height: "220px",
          background: "#fcede4",
          top: "120px",
          left: "24px",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full opacity-95 hidden md:block"
        style={{
          width: "280px",
          height: "280px",
          background: "#efe6dc",
          top: "40px",
          right: "40px",
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: "1296px", display: "flex", flexDirection: "column", gap: "56px" }}
      >
        {/* Heading */}
        <div className="flex flex-col items-center justify-center gap-5 text-center px-4">
          <div className="flex items-center gap-4 text-[#e85a1f] text-sm font-bold uppercase tracking-[0.18em] whitespace-nowrap">
            <span className="block w-14 h-px bg-[#e85a1f] opacity-45" />
            <span>Our Services</span>
            <span className="block w-14 h-px bg-[#e85a1f] opacity-45" />
          </div>
          <h2
            className="font-extrabold leading-tight"
            style={{
              fontSize: isMobile ? "24px" : "40px",
              maxWidth: "860px",
              color: "#181615",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            Comprehensive Battery Solutions
          </h2>
          <p
            className="mt-2 leading-relaxed"
            style={{
              fontSize: isMobile ? "16px" : "18px",
              maxWidth: "760px",
              color: "#6e645b",
              lineHeight: "1.7",
            }}
          >
            From installation to recycling, we manage the entire lifecycle of your industrial power systems with precision, speed, and expert care.
          </p>
        </div>

        {/* Services Grid */}
        <div
          className="grid gap-6 w-full"
          style={{
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
          }}
        >
          {services.map((service, index) => {
            const IconComponent = getIcon(service.iconName);
            const imageUrl = getImageUrl(service.imageUrl) || defaultImages[index % defaultImages.length];
            const isFeatured = index === 1;

            return (
              <motion.div
                key={service._id || index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.3 }}
                className="relative overflow-hidden rounded-[28px] h-[280px] flex items-end"
                style={{
                  background: isFeatured
                    ? "linear-gradient(135deg, #181615 0%, #26211f 100%)"
                    : "linear-gradient(180deg, #fffdfc 0%, #fffdfc 100%)",
                  border: "1px solid #e7ddd1",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(232, 90, 31, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                whileHover={{ 
                  transition: { duration: 0.3 }
                }}
              >
                {/* Service Image */}
                <img
                  src={imageUrl}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ zIndex: 0 }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    zIndex: 1,
                    background: isFeatured
                      ? "linear-gradient(180deg, rgba(24, 22, 21, 0.08) 0%, rgba(24, 22, 21, 0.22) 32%, rgba(24, 22, 21, 0.74) 100%)"
                      : "linear-gradient(180deg, rgba(24, 22, 21, 0.08) 0%, rgba(24, 22, 21, 0.24) 28%, rgba(24, 22, 21, 0.82) 68%, rgba(24, 22, 21, 0.94) 100%)",
                  }}
                />

                {/* Card Glow */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "140px",
                    height: "140px",
                    background: "rgba(232, 90, 31, 0.18)",
                    right: "-48px",
                    bottom: "-52px",
                    zIndex: 1,
                  }}
                />

                {/* Top Section */}
                <div
                  className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3"
                  style={{ zIndex: 2 }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: isFeatured
                        ? "rgba(252, 237, 228, 0.22)"
                        : "rgba(252, 237, 228, 0.86)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <IconComponent
                      size={20}
                      style={{ color: "#e85a1f" }}
                    />
                  </div>
                  <div
                    className="text-sm font-bold tracking-[0.14em] pt-2"
                    style={{
                      color: "rgba(255, 255, 255, 0.92)",
                      zIndex: 2,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Main Content */}
                <div
                  className="relative w-full flex flex-col gap-3 px-6 pb-6 pt-24"
                  style={{ zIndex: 2 }}
                >
                  <h3
                    className="font-extrabold leading-tight"
                    style={{
                      fontSize: "24px",
                      color: "#ffffff",
                      textShadow: "0 3px 14px rgba(0, 0, 0, 0.5)",
                      lineHeight: "1.12",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.92)",
                      lineHeight: "1.65",
                      textShadow: "0 3px 14px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {service.heroDescription || service.description}
                  </p>

                  {/* Tags */}
                  {service.keyHighlights && service.keyHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {service.keyHighlights.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            background: "rgba(24, 22, 21, 0.52)",
                            color: "#ffffff",
                            backdropFilter: "blur(4px)",
                            lineHeight: 1,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Learn More */}
                  <div
                    className="flex items-center gap-2 mt-2 cursor-pointer font-bold"
                    style={{
                      fontSize: "14px",
                      color: "#ffffff",
                      textShadow: "0 3px 14px rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/service/${service.slug}`);
                    }}
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} style={{ color: "#ffffff" }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}