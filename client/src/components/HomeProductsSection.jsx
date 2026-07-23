import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp, FaStar, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { productsApi } from "../utils/api";

export default function HomeProductsSection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    productsApi.getAll({ featuredOnHome: true, status: 'Active', limit: 8 })
      .then(res => setProducts(res.data || []))
      .catch(() => {});
  }, []);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveSlide(newIndex);
  };

  const scrollToSlide = (index) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth'
    });
    setActiveSlide(index);
  };

  return (
    <section className="relative bg-white py-12 md:py-24 px-4 sm:px-8 md:px-16 overflow-hidden font-sans select-none">
      {/* Ambient blobs */}
      <div className="absolute w-64 h-64 bg-[#fcede4] rounded-full top-10 right-10 z-0 pointer-events-none blur-xl opacity-60" />
      <div className="absolute w-48 h-48 bg-[#efe6dc] rounded-full bottom-10 left-10 z-0 pointer-events-none blur-xl opacity-60" />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 text-[#F06123] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="block w-8 h-[2px] bg-[#F06123] opacity-60" />
              Our Products
              <span className="block w-8 h-[2px] bg-[#F06123] opacity-60" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Industrial Battery Solutions
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-2 max-w-lg leading-relaxed">
              Premium-grade batteries engineered for critical infrastructure and field operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2 border-2 border-[#F06123] text-[#F06123] hover:bg-[#F06123] hover:text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md"
            >
              See All Products <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with swipe */}
        <div className="block md:hidden">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1 -mx-4 px-5 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {products.map((product, index) => (
              <div key={product.slug || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <ShowcaseCard product={product} index={index} isMobile={true} />
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          {products.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-6 bg-[#F06123]' : 'w-2 bg-slate-200'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP GRID (>= 768px): Clean 4-Column Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ShowcaseCard key={product.slug || index} product={product} index={index} isMobile={false} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ShowcaseCard({ product, index, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const whatsappUrl = `https://wa.me/61402277723?text=${encodeURIComponent(product.whatsappMessage || product.name || '')}`;
  const slug = product.slug;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: isMobile ? 0 : index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden h-[380px] w-full cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100"
    >
      {/* Background Image */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${hovered || isMobile ? 'scale-105' : 'scale-100'}`}
      />

      {/* Dark Overlay Gradient */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        hovered || isMobile
          ? 'bg-gradient-to-t from-black/95 via-black/40 to-black/10'
          : 'bg-gradient-to-t from-black/85 via-black/30 to-black/5'
      }`} />

      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
        <span className="bg-[#F06123] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {product.category || 'Battery'}
        </span>
        {product.saleLabel && (
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            -{product.saleLabel}
          </span>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className={`absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2 z-10 transition-transform duration-300 ${
        hovered || isMobile ? 'translate-y-0' : 'translate-y-2'
      }`}>
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map(i => <FaStar key={i} className="text-[11px] text-[#F06123]" />)}
          <FaStar className="text-[11px] text-white/30" />
          <span className="text-[11px] text-white/70 ml-1 font-medium">
            {product.rating || 4.8} · {product.stockStatus || 'In Stock'}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2">
          {product.displayTitle || product.name}
        </h3>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-[#FF8803]">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-white/50 line-through">
              ${typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice}
            </span>
          )}
        </div>

        {/* Action Buttons (Always visible on mobile, hover visible on desktop) */}
        <div className={`grid grid-cols-2 gap-2 mt-1 transition-all duration-300 ${
          isMobile || hovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 bg-[#25d366] hover:bg-[#1fb85a] text-white text-xs font-bold py-2 rounded-lg transition-colors text-center"
          >
            <FaWhatsapp className="text-sm" /> Buy
          </a>
          <Link
            to={`/product/${slug}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 bg-[#F06123] hover:bg-[#FF8803] text-white text-xs font-bold py-2 rounded-lg transition-colors text-center"
          >
            Details <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
