import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaStar, FaArrowRight } from "react-icons/fa";
import { productsApi } from "../utils/api";

export default function HomeProductsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi.getAll({ featuredOnHome: true, status: 'Active', limit: 8 })
      .then(res => setProducts(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "80px 72px 96px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "absolute", width: 260, height: 260, background: "#fcede4", borderRadius: "50%", top: 40, right: 60, zIndex: 0 }} />
      <div style={{ position: "absolute", width: 180, height: 180, background: "#efe6dc", borderRadius: "50%", bottom: 80, left: 40, zIndex: 0 }} />
      <div style={{ maxWidth: 1296, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#e85a1f", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>
              <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#e85a1f", opacity: 0.5 }} />
              Our Products
              <span style={{ display: "block", width: 48, height: 1, backgroundColor: "#e85a1f", opacity: 0.5 }} />
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#181615", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
              Industrial Battery Solutions
            </h2>
            <p style={{ fontSize: 15, color: "#6e645b", marginTop: 8, lineHeight: 1.7, maxWidth: 480 }}>
              Premium-grade batteries engineered for critical infrastructure and field operations.
            </p>
          </div>
          <button
            onClick={() => navigate("/product")}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#e85a1f"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#e85a1f"; }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "2px solid #e85a1f", color: "#e85a1f", backgroundColor: "transparent",
              fontWeight: 700, fontSize: 14, padding: "10px 24px", borderRadius: 50,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            }}
          >
            See All Products <FaArrowRight size={13} />
          </button>
        </div>

        {/* Cards — one row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {products.map((product, index) => (
            <ShowcaseCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ product, index }) {
  const [hovered, setHovered] = useState(false);
  const whatsappUrl = `https://wa.me/61402277723?text=${encodeURIComponent(product.whatsappMessage || product.name || '')}`;
  const slug = product.slug;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        height: 380,
        cursor: "pointer",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.22)" : "0 4px 18px rgba(0,0,0,0.10)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Background image */}
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.5s ease",
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hovered
          ? "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.92) 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.82) 100%)",
        transition: "background 0.3s ease",
      }} />

      {/* Top badges */}
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          backgroundColor: "#e85a1f", color: "#fff",
          fontSize: 10, fontWeight: 700,
          padding: "4px 10px", borderRadius: 20,
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          {product.category}
        </span>
        <span style={{
          backgroundColor: "rgba(0,0,0,0.55)", color: "#fff",
          fontSize: 11, fontWeight: 700,
          padding: "4px 10px", borderRadius: 6,
          backdropFilter: "blur(4px)",
          display: product.saleLabel ? "block" : "none",
        }}>
          -{product.saleLabel}
        </span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 18px",
        display: "flex", flexDirection: "column", gap: 8,
        transform: hovered ? "translateY(-16px)" : "translateY(0)",
        transition: "transform 0.3s ease",
      }}>
        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[1,2,3,4].map(i => <FaStar key={i} size={11} color="#f06123" />)}
          <FaStar size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginLeft: 4 }}>{product.rating || 4.8} · {product.stockStatus || 'In Stock'}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.25, margin: 0 }}>
          {product.displayTitle || product.name}
        </h3>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#ff7a3d" }}>${product.price?.toFixed ? product.price.toFixed(2) : product.price}</span>
          {product.oldPrice ? <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>${product.oldPrice?.toFixed ? product.oldPrice.toFixed(2) : product.oldPrice}</span> : null}
        </div>

        {/* Action buttons — visible on hover */}
        <div style={{
          display: "flex", gap: 8,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
              backgroundColor: "#25d366", color: "#fff",
              fontWeight: 700, fontSize: 12,
              padding: "9px 0", borderRadius: 10,
              textDecoration: "none",
            }}
          >
            <FaWhatsapp size={13} /> Buy
          </a>
          <Link
            to={`/product/${slug}`}
            onClick={e => e.stopPropagation()}
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
              backgroundColor: "#D4480A", color: "#fff",
              fontWeight: 700, fontSize: 12,
              padding: "9px 0", borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Details <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
