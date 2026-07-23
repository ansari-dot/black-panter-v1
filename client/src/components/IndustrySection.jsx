import React from "react";
import { motion } from "framer-motion";
import workerImg from "../assets/w.webp";

const IndustrySection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const leftVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const rightVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const headingVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const badgeVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Scroll-based animation variants for left side
  const scrollLeftVariants = {
    initial: { x: -50, opacity: 0.8 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scrollHeadingVariants = {
    initial: { y: -30, opacity: 0.8 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const scrollBadgeVariants = {
    initial: { y: 20, opacity: 0.7, scale: 0.95 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  const styles = {
    section: {
      width: "100%",
      minHeight: "auto",
      padding: "72px 20px",
      background: "#F9FAFB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      overflowX: "hidden",
    },

    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      gap: "clamp(20px, 5vw, 60px)",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      overflow: "hidden",
    },

    left: {
      flex: "1 1 400px",
      minWidth: "300px",
      color: "#383A3C",
    },

    heading: {
      fontSize: "clamp(1.4rem, 4vw, 2.6rem)",
      fontWeight: "900",
      color: "#070B15",
      marginBottom: "clamp(15px, 3vw, 20px)",
      lineHeight: "1.2",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },

    line: {
      width: "clamp(40px, 4vw, 60px)",
      height: "4px",
      background: "#F06123",
      borderRadius: "4px",
      marginBottom: "clamp(20px, 3vw, 30px)",
    },

    description: {
      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
      lineHeight: "1.6",
      color: "rgba(0, 0, 0, 0.60)",
      marginBottom: "clamp(25px, 4vw, 40px)",
      maxWidth: "100%",
    },

    badgeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "clamp(10px, 2vw, 15px)",
      marginBottom: "clamp(25px, 4vw, 40px)",
      width: "100%",
    },

    badge: {
      background: "white",
      padding: "clamp(8px, 2vw, 12px) clamp(12px, 2vw, 16px)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "clamp(8px, 1.5vw, 12px)",
      fontSize: "clamp(0.75rem, 1.5vw, 14px)",
      color: "#444",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      border: "1.12px rgba(0, 0, 0, 0.08) solid",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },

    dot: {
      width: "clamp(6px, 1.5vw, 8px)",
      height: "clamp(6px, 1.5vw, 8px)",
      background: "#F06123",
      borderRadius: "50%",
      flexShrink: 0,
    },

    highlightBox: {
      background: "rgba(240, 97, 35, 0.10)",
      padding: "clamp(15px, 3vw, 20px) clamp(18px, 3vw, 24px)",
      borderRadius: "12px",
      fontSize: "clamp(0.85rem, 1.5vw, 15px)",
      color: "#F06123",
      maxWidth: "100%",
      borderLeft: "4px solid #F06123",
      border: "1.12px rgba(0, 0, 0, 0.08) solid",
      width: "100%",
      boxSizing: "border-box",
    },

    right: {
      flex: "1 1 400px",
      minWidth: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      marginTop: "0",
    },

    image: {
      width: "100%",
      maxWidth: "clamp(300px, 50vw, 500px)",
      borderRadius: "20px",
      objectFit: "cover",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      border: "1.12px rgba(0, 0, 0, 0.08) solid",
      height: "auto",
    },

    // Responsive styles
    '@media (max-width: 1024px)': {
      container: {
        flexDirection: "column",
        gap: "40px",
        textAlign: "center",
        padding: "0 20px",
      },
      left: {
        textAlign: "center",
        flex: "1 1 100%",
      },
      right: {
        flex: "1 1 100%",
        marginTop: "0",
      },
      badgeGrid: {
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        maxWidth: "600px",
        margin: "0 auto",
      },
    },

    '@media (max-width: 768px)': {
      section: {
        padding: "40px 15px",
      },
      container: {
        gap: "30px",
        padding: "0 15px",
      },
      heading: {
        fontSize: "clamp(1.15rem, 4.5vw, 1.8rem)",
      },
      description: {
        fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
      },
      badgeGrid: {
        gridTemplateColumns: "1fr",
        gap: "12px",
        maxWidth: "350px",
      },
      badge: {
        fontSize: "clamp(0.7rem, 2vw, 13px)",
        padding: "10px 14px",
      },
      highlightBox: {
        fontSize: "clamp(0.8rem, 2vw, 14px)",
        padding: "16px 20px",
        maxWidth: "350px",
        margin: "0 auto",
      },
      image: {
        maxWidth: "100%",
      },
    },

    '@media (max-width: 480px)': {
      section: {
        padding: "30px 10px",
        minHeight: "auto",
      },
      container: {
        gap: "20px",
        padding: "0 10px",
      },
      heading: {
        fontSize: "1.25rem",
        marginBottom: "15px",
      },
      line: {
        width: "40px",
        marginBottom: "20px",
      },
      description: {
        fontSize: "0.9rem",
        marginBottom: "20px",
      },
      badge: {
        fontSize: "0.75rem",
        padding: "8px 12px",
        gap: "8px",
      },
      dot: {
        width: "6px",
        height: "6px",
      },
      highlightBox: {
        fontSize: "0.8rem",
        padding: "12px 16px",
      },
    }
  };

  const services = [
    "Power generation & utilities",
    "Telecommunications infrastructure",
    "Data centers & server farms",
    "Healthcare facilities",
    "Transportation & logistics",
    "Manufacturing plants",
    "Oil and gas"
  ];

  return (
    <motion.section
      style={styles.section}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div style={styles.container}>

        {/* LEFT CONTENT */}
        <motion.div
          style={styles.left}
          variants={scrollLeftVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h2
            style={styles.heading}
            variants={scrollHeadingVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            Powering Industry Since 2005
          </motion.h2>
          <motion.div
            style={styles.line}
            variants={scrollHeadingVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          ></motion.div>

          <motion.p style={styles.description}>
            We are a full-service industrial battery maintenance facility
            with 20+ years of experience specializing in preventive care,
            troubleshooting, and lifecycle management of high-reliability
            battery systems.
          </motion.p>

          <motion.div style={styles.badgeGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                style={styles.badge}
                variants={scrollBadgeVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(240, 97, 35, 0.2)",
                  transition: { duration: 0.2 }
                }}
              >
                <motion.span
                  style={styles.dot}
                  animate={{
                    scale: [1, 1.3, 1],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: index * 0.2
                    }
                  }}
                ></motion.span>
                {service}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={styles.highlightBox}
            variants={scrollBadgeVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 6px 20px rgba(240, 97, 35, 0.15)",
              transition: { duration: 0.3 }
            }}
            animate={{
              y: [0, -5, 0],
              transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            <strong>Key outcomes:</strong> Uninterrupted operations,
            reduced downtime, extended battery life.
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          style={styles.right}
          variants={rightVariants}
        >
          <motion.img
            src={workerImg}
            alt="Industry Work"
            style={styles.image}
            width="500"
            height="333"
            loading="lazy"
            decoding="async"
            variants={imageVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.3 }
            }}
          />
        </motion.div>

      </motion.div>
    </motion.section>
  );
};

export default IndustrySection;
