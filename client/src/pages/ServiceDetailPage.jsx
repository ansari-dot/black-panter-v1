import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon, CheckCircle2Icon, ShieldIcon, ActivityIcon, SettingsIcon, ShieldCheckIcon, ZapIcon, ChevronLeftIcon } from "lucide-react";
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
    return <div className="p-8 text-center font-body">Service not found</div>;
  }

  // Create a gallery array for the slider. Fallback to duplicated images if no gallery exists.
  const galleryImages = service.gallery || [
    service.detailImageUrl,
    service.imageUrl,
    "https://storage.googleapis.com/banani-generated-images/generated-images/7d66692f-d887-4861-bc6d-74007658d57d.jpg" // Placeholder for demonstration
  ].filter(Boolean);

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

  const styles = {
    page: {
      backgroundColor: "#ffffff",
      color: "#1a1a1a",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    outer: {
      padding: "64px 64px 72px",
      maxWidth: "1440px",
      margin: "0 auto"
    },
    introRow: {
      display: "flex",
      gap: "64px",
      alignItems: "flex-start",
      flexWrap: "wrap"
    },
    introMain: {
      flex: 1,
      minWidth: "320px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    eyebrow: {
      fontSize: "12px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "#f06123",
      margin: 0
    },
    title: {
      fontSize: "clamp(34px, 4vw, 48px)",
      lineHeight: 1.15,
      fontWeight: 700,
      margin: 0,
      color: "#1a1a1a"
    },
    bodyText: {
      fontSize: "16px",
      lineHeight: 1.8,
      color: "#666",
      margin: 0,
      whiteSpace: "pre-line"
    },
    sidebar: {
      width: "320px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    },
    infoCard: {
      backgroundColor: "#f8f7f5",
      border: "1px solid #e8e3de",
      borderRadius: "12px",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    infoTitle: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#1a1a1a",
      margin: 0,
      marginBottom: "8px"
    },
    infoList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: 0,
      margin: 0,
      listStyle: "none"
    },
    infoListItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      fontSize: "14px",
      color: "#333",
      lineHeight: 1.5
    },
    infoIcon: {
      color: "#f06123",
      flexShrink: 0,
      marginTop: "2px"
    },
    quoteButton: {
      backgroundColor: "#f06123",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "16px 24px",
      fontSize: "15px",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background-color 0.2s ease"
    },
    staticBox2: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    },
    staticBox2IconWrap: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      backgroundColor: "#f06123",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      marginBottom: "8px"
    },
    staticBox2Title: {
      fontSize: "17px",
      fontWeight: 700,
      color: "#1a202c",
      margin: 0
    },
    staticBox2Text: {
      fontSize: "15px",
      color: "#4a5568",
      lineHeight: 1.5,
      margin: 0
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      marginTop: "80px"
    },
    sectionHeader: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    sectionKicker: {
      fontSize: "12px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "#f06123",
      margin: 0
    },
    sectionTitle: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#1a1a1a",
      margin: 0
    },
    
    // Slider Styles
    sliderContainer: {
      position: "relative",
      width: "100%",
      height: "400px",
      borderRadius: "16px",
      overflow: "hidden",
      marginTop: "48px",
      boxShadow: "0 24px 50px rgba(0,0,0,0.1)",
      group: "slider"
    },
    sliderInner: {
      display: "flex",
      width: "100%",
      height: "100%",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: `translateX(-${currentImageIndex * 100}%)`
    },
    slideItem: {
      minWidth: "100%",
      height: "100%",
      position: "relative"
    },
    imageFit: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    },
    sliderBtn: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.9)",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      color: "#1a1a1a",
      zIndex: 10,
      transition: "all 0.2s ease"
    },
    sliderDots: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
      zIndex: 10
    },
    dot: (active) => ({
      width: active ? "24px" : "8px",
      height: "8px",
      borderRadius: "4px",
      backgroundColor: active ? "#f06123" : "rgba(255,255,255,0.6)",
      transition: "all 0.3s ease",
      cursor: "pointer"
    }),

    // Sexy Boxes Grid
    resultsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "32px"
    },
    resultCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #f0ece8",
      borderRadius: "20px",
      padding: "36px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
    },
    resultCardHover: `
      .sexy-box:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(240, 97, 35, 0.12);
        border-color: #f06123;
      }
      .sexy-box:hover .icon-container {
        background: linear-gradient(135deg, #f06123 0%, #ff8803 100%);
        color: #ffffff !important;
        transform: scale(1.1);
      }
      .sexy-box .bg-decoration {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(240,97,35,0.08) 0%, transparent 70%);
        border-radius: 50%;
        transition: all 0.5s ease;
        z-index: 1;
      }
      .sexy-box:hover .bg-decoration {
        transform: scale(1.5);
      }
      .slider-btn:hover {
        background-color: #f06123 !important;
        color: white !important;
        transform: translateY(-50%) scale(1.1) !important;
      }
    `,
    resultIconContainer: {
      width: "64px",
      height: "64px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(240,97,35,0.1) 0%, rgba(255,136,3,0.1) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#f06123",
      fontSize: "28px",
      transition: "all 0.4s ease",
      position: "relative",
      zIndex: 2
    },
    resultTitle: {
      fontSize: "20px",
      fontWeight: 700,
      margin: 0,
      color: "#1a1a1a",
      position: "relative",
      zIndex: 2
    },
    resultText: {
      fontSize: "15px",
      lineHeight: 1.7,
      margin: 0,
      color: "#666",
      position: "relative",
      zIndex: 2
    },
    ctaBar: {
      marginTop: "80px",
      background: "linear-gradient(135deg, #1d1f24 0%, #383A3C 100%)",
      borderRadius: "24px",
      padding: "56px 64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "32px",
      flexWrap: "wrap",
      boxShadow: "0 24px 50px rgba(0,0,0,0.2)"
    },
    ctaTitle: {
      fontSize: "36px",
      fontWeight: 700,
      color: "#fff",
      margin: 0,
      marginBottom: "12px",
      letterSpacing: "-0.02em"
    },
    ctaText: {
      fontSize: "16px",
      color: "#bcbcbc",
      margin: 0,
      maxWidth: "500px",
      lineHeight: 1.6
    },
    ctaButtons: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap"
    },
    ctaPrimary: {
      backgroundColor: "#f06123",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "16px 28px",
      fontSize: "16px",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      transition: "background-color 0.2s ease"
    },
    ctaSecondary: {
      backgroundColor: "transparent",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "8px",
      padding: "16px 28px",
      fontSize: "16px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      transition: "background-color 0.2s ease"
    }
  };

  // Helper to render dynamic Fa icons
  const renderIcon = (iconName) => {
    const Icon = FaIcons[iconName];
    if (Icon) return <Icon />;
    return <SettingsIcon />; // fallback
  };

  return (
    <div style={styles.page}>
      <style>{styles.resultCardHover}</style>
      <PageLayout heroContent={heroContent} vectorBackground={serviceDetailHeroImage}>
        <div style={styles.outer}>
          
          <div style={styles.introRow}>
            <div style={styles.introMain}>
              <p style={styles.eyebrow}>About the Service</p>
              <h2 style={styles.title}>{service.criticalPowerTitle}</h2>
              <p style={styles.bodyText}>
                {service.criticalPowerDescription}
              </p>
              
              {galleryImages.length > 0 && (
                <div style={styles.sliderContainer}>
                  <div style={styles.sliderInner}>
                    {galleryImages.map((img, idx) => (
                      <div key={idx} style={styles.slideItem}>
                        <img src={img} alt={`${service.title} view ${idx + 1}`} style={styles.imageFit} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Slider Controls */}
                  {galleryImages.length > 1 && (
                    <>
                      <button 
                        className="slider-btn" 
                        style={{...styles.sliderBtn, left: "20px"}} 
                        onClick={prevImage}
                      >
                        <ChevronLeftIcon size={24} />
                      </button>
                      <button 
                        className="slider-btn" 
                        style={{...styles.sliderBtn, right: "20px"}} 
                        onClick={nextImage}
                      >
                        <ChevronRightIcon size={24} />
                      </button>
                      
                      <div style={styles.sliderDots}>
                        {galleryImages.map((_, idx) => (
                          <div 
                            key={idx} 
                            style={styles.dot(currentImageIndex === idx)}
                            onClick={() => setCurrentImageIndex(idx)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div style={styles.sidebar}>
              <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Key Highlights</h3>
                <ul style={styles.infoList}>
                  {service.keyHighlights?.map((highlight, index) => (
                    <li key={index} style={styles.infoListItem}>
                      <CheckCircle2Icon size={18} style={styles.infoIcon} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {(service.certificationTitle || service.certificationDescription) && (
                <div style={{...styles.infoCard, backgroundColor: "#fff", border: "1px solid #f06123"}}>
                  {service.certificationTitle && (
                    <h3 style={{...styles.infoTitle, color: "#f06123"}}>{service.certificationTitle}</h3>
                  )}
                  {service.certificationDescription && (
                    <p style={{fontSize: "14px", color: "#666", lineHeight: 1.5, margin: 0}}>
                      {service.certificationDescription}
                    </p>
                  )}
                </div>
              )}

              <Link to="/contact" style={styles.quoteButton}>
                Schedule Service
                <ArrowRightIcon size={16} />
              </Link>

              {/* Static Box 2 */}
              <div style={styles.staticBox2}>
                <div style={styles.staticBox2IconWrap}>
                  <ShieldCheckIcon size={28} />
                </div>
                <h3 style={styles.staticBox2Title}>Australian Standards Compliant</h3>
                <p style={styles.staticBox2Text}>
                  All maintenance programs meet or exceed Australian reliability standards.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <p style={styles.sectionKicker}>Our Expertise</p>
              <h3 style={styles.sectionTitle}>Technical Procedures</h3>
              <p style={{color: "#666", fontSize: "16px", maxWidth: "600px", marginTop: "8px"}}>
                From installation to maintenance, we manage the entire lifecycle of your industrial power systems with precision.
              </p>
            </div>
            
            <div style={styles.resultsGrid}>
              {service.technicalProcedures?.map((proc) => (
                <div key={proc.title} style={styles.resultCard} className="sexy-box">
                  <div className="bg-decoration"></div>
                  <div style={styles.resultIconContainer} className="icon-container">
                    {renderIcon(proc.icon)}
                  </div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h4 style={styles.resultTitle}>{proc.title}</h4>
                    <p style={styles.resultText}>{proc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.ctaBar}>
            <div>
              <p style={{color: "#f06123", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px"}}>
                {service.emergencyTitle}
              </p>
              <h3 style={styles.ctaTitle}>Need Immediate Support?</h3>
              <p style={styles.ctaText}>{service.emergencyDescription}</p>
            </div>
            <div style={styles.ctaButtons}>
              <Link to="/contact" style={styles.ctaPrimary}>
                <FaIcons.FaPhoneAlt />
                Contact 24/7 Hotline
              </Link>
              <Link to="/services" style={styles.ctaSecondary}>
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
