import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CalendarCheckIcon, CheckCircle2Icon, ChevronRightIcon, ShieldIcon, TrendingUpIcon, UsersIcon, ZapIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ProjectDetailHeroSection";
import Footer from "../components/Footer";
import { projectsApi, resolveImageUrl } from "../utils/api";
import serviceDetailHeroImage from '../assets/herosections/servicedetails.webp';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsApi.getBySlug(slug);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p>Project not found</p>
        <Link to="/" style={{ color: '#f06123' }}>Back to Home</Link>
      </div>
    );
  }

  const heroContent = (
    <HeroSection
      badge={project?.heroBadge || "Project Detail"}
      title={project?.heroTitle || {
        line1: { white: "Project ", orange: "Overview" },
        line2: { white: "Complete ", orange: "Information" }
      }}
      description={project?.heroDescription || "Discover detailed information about this project, including specifications, outcomes, and key highlights."}
    />
  );

  const primaryFacts = [
    { label: "Timeline", value: project.timeline || 'N/A' },
    { label: "Installed", value: project.unitsInstalled || 'N/A' },
    { label: "Uptime", value: project.uptime || 'N/A' },
  ].filter(f => f.value !== 'N/A');

  const clientFacts = [
    { label: "Client", value: project.clientName },
    { label: "Location", value: project.location },
    { label: "Sector", value: project.sector },
    { label: "Completed", value: project.completedDate },
  ].filter(f => f.value);

  const gallery = project.gallery?.length > 0 ? project.gallery.map(resolveImageUrl) : [];

  const styles = {
    page: {
      backgroundColor: "#ffffff",
      color: "#1a1a1a",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    outer: {
      padding: "64px 64px 72px"
    },
    introRow: {
      display: "flex",
      gap: "48px",
      alignItems: "flex-start"
    },
    introMain: {
      flex: 1,
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
      fontSize: "15px",
      lineHeight: 2,
      color: "#888",
      margin: 0
    },
    statsRow: {
      display: "flex",
      alignItems: "center",
      gap: "24px",
      paddingTop: "8px",
      flexWrap: "wrap"
    },
    statBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    statValue: {
      fontSize: "28px",
      lineHeight: 1,
      fontWeight: 700,
      color: "#1a1a1a"
    },
    statAccent: {
      color: "#f06123",
      fontSize: "18px"
    },
    statLabel: {
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#888"
    },
    divider: {
      width: "1px",
      height: "40px",
      backgroundColor: "#e5e5e5"
    },
    sidebar: {
      width: "256px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    infoCard: {
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    infoLabel: {
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#888",
      marginBottom: "2px"
    },
    infoValue: {
      fontSize: "15px",
      fontWeight: 700,
      color: "#1a1a1a"
    },
    quoteButton: {
      backgroundColor: "#f06123",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "14px 20px",
      fontSize: "14px",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      cursor: "pointer",
      textDecoration: "none"
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "40px"
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px"
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
      fontSize: "28px",
      fontWeight: 700,
      color: "#1a1a1a",
      margin: 0
    },
    galleryGrid: {
      display: "grid",
      gridTemplateColumns: gallery.length > 1 ? "7fr 5fr" : "1fr",
      gap: "12px"
    },
    galleryMain: {
      height: "320px",
      borderRadius: "8px",
      overflow: "hidden"
    },
    galleryStack: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    gallerySmall: {
      height: "154px",
      borderRadius: "8px",
      overflow: "hidden"
    },
    imageFit: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    },
    highlightsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px"
    },
    highlightCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e5e5e5",
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px"
    },
    highlightIcon: {
      width: "24px",
      height: "24px",
      color: "#f06123",
      flexShrink: 0
    },
    highlightText: {
      fontSize: "14px",
      lineHeight: 1.6,
      color: "#1a1a1a"
    },
    metricsGrid: {
      display: "flex",
      gap: "24px",
      flexWrap: "wrap"
    },
    metricCard: {
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      padding: "16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    metricValue: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#f06123"
    },
    metricLabel: {
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#888"
    },
    processGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "12px"
    },
    processCard: {
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      minHeight: "120px"
    },
    processNumber: {
      position: "absolute",
      top: "8px",
      right: "16px",
      fontSize: "48px",
      fontWeight: 700,
      color: "#e5e5e5",
      lineHeight: 1
    },
    processIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "4px",
      backgroundColor: "#f06123",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      marginBottom: "18px"
    },
    ctaBar: {
      marginTop: "24px",
      backgroundColor: "#1a1a1a",
      borderRadius: "8px",
      padding: "32px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px"
    },
    ctaTitle: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#fff",
      margin: 0
    },
    ctaText: {
      fontSize: "14px",
      color: "#bcbcbc",
      margin: "6px 0 0"
    },
    ctaButtons: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap"
    },
    ctaPrimary: {
      backgroundColor: "#f06123",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "14px 18px",
      fontSize: "14px",
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none"
    },
    ctaSecondary: {
      backgroundColor: "transparent",
      color: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: "4px",
      padding: "14px 18px",
      fontSize: "14px",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none"
    }
  };

  return (
    <div style={styles.page}>
      <PageLayout 
        heroContent={heroContent}
        vectorBackground={serviceDetailHeroImage}
      >
        <div style={styles.outer}>
          <div style={styles.introRow}>
            <div style={styles.introMain}>
              <p style={styles.eyebrow}>About the Project</p>
              <h2 style={styles.title}>{project.title}</h2>
              <p style={styles.bodyText}>
                {project.description}
              </p>

              {primaryFacts.length > 0 && (
                <div style={styles.statsRow}>
                  {primaryFacts.map((item, index) => (
                    <React.Fragment key={item.label}>
                      <div style={styles.statBlock}>
                        <span style={styles.statValue}>{item.value.split(" ")[0]} <span style={styles.statAccent}>{item.value.split(" ").slice(1).join(" ")}</span></span>
                        <span style={styles.statLabel}>{item.label}</span>
                      </div>
                      {index < primaryFacts.length - 1 && <div style={styles.divider} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {clientFacts.length > 0 && (
              <div style={styles.sidebar}>
                <div style={styles.infoCard}>
                  {clientFacts.map((item, index) => (
                    <div key={item.label}>
                      <div style={styles.infoLabel}>{item.label}</div>
                      <div style={styles.infoValue}>{item.value}</div>
                      {index < clientFacts.length - 1 && <div style={{ height: 1, backgroundColor: "#e5e5e5", marginTop: 16 }} />}
                    </div>
                  ))}
                </div>
                <Link to="/contact" style={styles.quoteButton}>
                  Get a Quote
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            )}
          </div>

          {gallery.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Project Gallery</h3>
              </div>
              <div style={styles.galleryGrid}>
                <div style={styles.galleryMain}>
                  <img src={gallery[0]} alt={`${project.title} main`} style={styles.imageFit} />
                </div>
                {gallery.length > 1 && (
                  <div style={styles.galleryStack}>
                    {gallery.slice(1, 3).map((img, idx) => (
                      <div key={idx} style={styles.gallerySmall}>
                        <img src={img} alt={`${project.title} ${idx + 1}`} style={styles.imageFit} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <div style={styles.section}>
              <div style={styles.metricsGrid}>
                {project.metrics.map((metric, idx) => (
                  <div key={idx} style={styles.metricCard}>
                    <span style={styles.metricValue}>{metric.value}</span>
                    <span style={styles.metricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <p style={styles.sectionKicker}>Outcomes</p>
                  <h3 style={styles.sectionTitle}>Key Highlights</h3>
                </div>
              </div>
              <div style={styles.highlightsGrid}>
                {project.highlights.map((highlight, idx) => (
                  <div key={idx} style={styles.highlightCard}>
                    <CheckCircle2Icon style={styles.highlightIcon} />
                    <p style={styles.highlightText}>{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.process && project.process.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <p style={styles.sectionKicker}>Process</p>
                  <h3 style={styles.sectionTitle}>How We Delivered It</h3>
                </div>
              </div>
              <div style={styles.processGrid}>
                {project.process.map((step, index) => (
                  <div key={index} style={styles.processCard}>
                    <div style={styles.processNumber}>{String(index + 1).padStart(2, "0")}</div>
                    <div style={styles.processIcon}>
                      <ChevronRightIcon size={16} />
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1a1a1a", margin: 0, paddingRight: 32 }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.ctaBar}>
            <div>
              <h3 style={styles.ctaTitle}>Ready to start a similar project?</h3>
              <p style={styles.ctaText}>Tell us what you need — we'll handle the rest.</p>
            </div>
            <div style={styles.ctaButtons}>
              <Link to="/contact" style={styles.ctaPrimary}>
                Start a Project
                <ArrowRightIcon size={14} />
              </Link>
              <Link to="/" style={styles.ctaSecondary}>
                <ArrowLeftIcon size={14} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </PageLayout>
    </div>
  );
}
