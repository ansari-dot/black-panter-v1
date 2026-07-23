import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock3,
  ShieldCheck,
  ChevronDown,
  Navigation,
  FileText,
  Send,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInLeft = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeInRight = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Lighter animation for mobile
  const mobileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service.trim(),
          subject: formData.service.trim() || "Client inquiry",
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send message");

      setSubmitSuccess(true);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Unable to send your message right now. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionStyle = {
    background: "#ffffff",
    padding: isMobile ? "60px 16px 80px" : "56px 72px 88px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const contentShellStyle = {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "48px",
  };

  const topSectionStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "340px minmax(0, 1fr)",
    gap: "28px",
    alignItems: "start",
  };

  const contactCardStyle = {
    background: "#ffffff",
    border: "1px solid #e8e2db",
    borderRadius: "12px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  };

  const sectionKickerStyle = {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#f97316",
    margin: 0,
  };

  const cardTitleStyle = {
    fontSize: "28px",
    lineHeight: "1.1",
    letterSpacing: "-0.6px",
    fontWeight: "800",
    color: "#141414",
    margin: 0,
  };

  const cardCopyStyle = {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#6b6b6b",
    margin: 0,
  };

  const statusPillStyle = {
    alignSelf: "flex-start",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#fff6ef",
    color: "#f97316",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    border: "none",
  };

  const contactListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const contactItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    background: "#fff6ef",
    borderRadius: "8px",
  };

  const contactIconBoxStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    background: "#ffffff",
    border: "1px solid #e8e2db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const contactItemTitleStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b6b6b",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    margin: "0 0 4px 0",
  };

  const contactItemValueStyle = {
    fontSize: "20px",
    lineHeight: "1.35",
    fontWeight: "700",
    color: "#141414",
    margin: 0,
  };

  const contactItemMetaStyle = {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b6b6b",
    margin: "4px 0 0 0",
  };

  const noteBoxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    background: "#fff6ef",
    borderRadius: "8px",
  };

  const noteIconStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const noteTextStyle = {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b6b6b",
    margin: 0,
  };

  const formPanelStyle = {
    background: "#ffffff",
    border: "1px solid #e8e2db",
    borderRadius: "12px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const formHeaderStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "620px",
  };

  const formRowStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "16px",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const smallLabelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    color: "#6b6b6b",
    margin: 0,
  };

  const formInputStyle = {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e8e2db",
    borderRadius: "8px",
    color: "#6b6b6b",
    fontSize: "14px",
    padding: "15px 16px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  const formSelectStyle = {
    ...formInputStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  };

  const formTextareaStyle = {
    ...formInputStyle,
    minHeight: "144px",
    padding: "16px",
    lineHeight: "1.6",
    resize: "vertical",
  };

  const quickActionsStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "12px",
  };

  const actionPillStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 16px",
    background: "#fff6ef",
    border: "1px solid #e8e2db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#141414",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const submitBtnStyle = {
    width: "100%",
    padding: "17px 20px",
    background: "#f97316",
    color: "#ffffff",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    border: "none",
    cursor: "pointer",
  };

  const formFootnoteStyle = {
    fontSize: "12px",
    lineHeight: "1.5",
    textAlign: "center",
    color: "#6b6b6b",
    margin: 0,
  };

  const mapHeaderStyle = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
  };

  const mapTitleWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "760px",
  };

  const mapMetaStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#f97316",
    whiteSpace: "nowrap",
  };

  const mapFrameStyle = {
    position: "relative",
    height: isMobile ? "350px" : "380px",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#fff6ef",
    border: "1px solid #e8e2db",
  };

  const mapImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const mapCardStyle = {
    position: "absolute",
    top: "24px",
    left: "24px",
    width: "250px",
    background: "rgba(255, 255, 255, 0.96)",
    borderRadius: "12px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const mapCardTitleStyle = {
    fontSize: "16px",
    fontWeight: "800",
    color: "#141414",
    margin: 0,
  };

  const mapCardCopyStyle = {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b6b6b",
    margin: 0,
  };

  const mapButtonStyle = {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 14px",
    borderRadius: "4px",
    background: "#f97316",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    border: "none",
    cursor: "pointer",
  };

  return (
    <>
      <section
        ref={sectionRef}
        style={sectionStyle}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div style={contentShellStyle}>
          {/* Top Section - Contact Card + Form */}
          <div style={topSectionStyle}>
            {/* Contact Card */}
            <motion.div
              style={contactCardStyle}
              variants={isMobile ? mobileVariants : fadeInLeft}
            >
              <div>
                <div style={sectionKickerStyle}>Direct contact</div>
                <h2 style={cardTitleStyle}>Talk to our team</h2>
                <p style={cardCopyStyle}>
                  Simple, fast contact for battery support, service, quotes and
                  urgent help.
                </p>
                <div style={{ marginTop: "12px" }}>
                  <span style={statusPillStyle}>Online now</span>
                </div>
              </div>

              <div style={contactListStyle}>
                {/* Phone */}
                <div style={contactItemStyle}>
                  <div style={contactIconBoxStyle}>
                    <PhoneCall size={20} color="#f97316" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={contactItemTitleStyle}>Call us</div>
                    <div style={contactItemValueStyle}>+61 402 277 723</div>
                    <div style={contactItemMetaStyle}>Best for urgent support</div>
                  </div>
                </div>

                {/* Email */}
                <div style={contactItemStyle}>
                  <div style={contactIconBoxStyle}>
                    <Mail size={20} color="#f97316" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={contactItemTitleStyle}>Email</div>
                    <div style={contactItemValueStyle}>
                      info@blackpanther-batteries.com
                    </div>
                    <div style={contactItemMetaStyle}>
                      Quotes and service requests
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={contactItemStyle}>
                  <div style={contactIconBoxStyle}>
                    <MapPin size={20} color="#f97316" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={contactItemTitleStyle}>Workshop</div>
                    <div style={contactItemValueStyle}>6/31 Gov Macquarie Dr</div>
                    <div style={contactItemMetaStyle}>NSW 2170, Australia</div>
                  </div>
                </div>

                {/* Hours */}
                <div style={contactItemStyle}>
                  <div style={contactIconBoxStyle}>
                    <Clock3 size={20} color="#f97316" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={contactItemTitleStyle}>Hours</div>
                    <div style={contactItemValueStyle}>Mon–Fri · 8 AM – 6 PM</div>
                    <div style={contactItemMetaStyle}>
                      24/7 emergency support available
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Box */}
              <div style={noteBoxStyle}>
                <div style={noteIconStyle}>
                  <ShieldCheck size={18} color="#f97316" />
                </div>
                <p style={noteTextStyle}>
                  Fast, clear replies for service, replacement and support.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              style={formPanelStyle}
              variants={isMobile ? mobileVariants : fadeInRight}
            >
              <div style={formHeaderStyle}>
                <div style={sectionKickerStyle}>Send a message</div>
                <h1 style={cardTitleStyle}>Tell us what you need</h1>
                <p style={cardCopyStyle}>
                  Keep it clear and easy. Send your details and our team will
                  get back to you quickly.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Form Row 1 */}
                <div style={formRowStyle}>
                  <div style={formGroupStyle}>
                    <label style={smallLabelStyle}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      style={errors.name ? { ...formInputStyle, border: "1px solid #ef4444" } : formInputStyle}
                    />
                    {errors.name && (
                      <span style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div style={formGroupStyle}>
                    <label style={smallLabelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="000-000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                {/* Form Row 2 */}
                <div style={formRowStyle}>
                  <div style={formGroupStyle}>
                    <label style={smallLabelStyle}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      style={errors.email ? { ...formInputStyle, border: "1px solid #ef4444" } : formInputStyle}
                    />
                    {errors.email && (
                      <span style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div style={formGroupStyle}>
                    <label style={smallLabelStyle}>Service Needed</label>
                    <div style={formSelectStyle}>
                      <span style={{ color: formData.service ? "#141414" : "#6b6b6b" }}>
                        {formData.service || "Battery service or replacement"}
                      </span>
                      <ChevronDown size={16} color="#6b6b6b" />
                    </div>
                    <select
                      value={formData.service}
                      onChange={(e) => handleInputChange("service", e.target.value)}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Select a service...</option>
                      <option value="Battery Testing">Battery Testing</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Reconditioning">Reconditioning</option>
                      <option value="Emergency Service">Emergency Service</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Field Services">Field Services</option>
                    </select>
                    {errors.service && (
                      <span style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
                        {errors.service}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div style={formGroupStyle}>
                  <label style={smallLabelStyle}>Your Message *</label>
                  <textarea
                    placeholder="Tell us what battery support you need and how soon you need help..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    style={errors.message ? { ...formTextareaStyle, border: "1px solid #ef4444" } : formTextareaStyle}
                  />
                  {errors.message && (
                    <span style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div style={quickActionsStyle}>
                  <div style={actionPillStyle}>
                    <Navigation size={16} color="#f97316" />
                    <span>Get directions</span>
                  </div>
                  <div style={actionPillStyle}>
                    <FileText size={16} color="#f97316" />
                    <span>Request quote</span>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  style={isSubmitting ? { ...submitBtnStyle, opacity: 0.5, cursor: "not-allowed" } : submitBtnStyle}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={18} color="#ffffff" />
                  <span>{isSubmitting ? "Submitting..." : "Send Message"}</span>
                </motion.button>

                {/* Success/Error Messages */}
                {submitSuccess && (
                  <div
                    style={{
                      backgroundColor: "#d1fae5",
                      border: "1px solid #6ee7b7",
                      color: "#065f46",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
                {errors.submit && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {errors.submit}
                  </div>
                )}

                <p style={formFootnoteStyle}>
                  We'll get back to you as soon as possible.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            style={mapFrameStyle}
            initial={{ opacity: 0, y: isMobile ? 20 : 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 20 : 50 }}
            transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? 0 : 0.4 }}
          >
            {/* Map Image */}
            <img
              src="https://storage.googleapis.com/banani-generated-images/generated-images/f117726e-cf52-4522-ba62-bc801ec48706.jpg"
              alt="Location Map"
              style={mapImageStyle}
            />

            {/* Map Overlay Card */}
            <motion.div
              style={mapCardStyle}
              initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
              transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
            >
              <h4 style={mapCardTitleStyle}>Our Location</h4>
              <p style={mapCardCopyStyle}>
                6/31 Gov Macquarie Dr
                <br />
                NSW 2170, Australia
              </p>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                <button style={mapButtonStyle}>
                  <Navigation size={14} color="#ffffff" />
                  <span>Get Directions</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;