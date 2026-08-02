import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppFloating = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const btnBase = {
    width: 56,
    height: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    textDecoration: "none",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 28,
            right: 24,
            display: "flex",
            gap: 12,
            zIndex: 9999,
          }}
        >
          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/61402277723"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            style={{ ...btnBase, backgroundColor: "#25D366" }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp size={28} color="white" />
          </motion.a>

          {/* Scroll to top */}
          <motion.button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{ ...btnBase, backgroundColor: "#F06123" }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={24} color="white" strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFloating;
