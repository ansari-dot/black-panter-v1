import React from "react";
import { Link } from "react-router-dom";

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
    fill={filled ? "#f06123" : "none"} stroke={filled ? "#f06123" : "#d1cdc9"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const ProductCard = ({ product }) => {
  const isNew = product.status === 'Active' && (product.rating >= 4.8 || !product.oldPrice);

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <article
        className="rounded-2xl overflow-hidden bg-white font-body cursor-pointer transition-all duration-300 group-hover:-translate-y-1"
        style={{ boxShadow: "0 2px 10px rgba(29,31,36,0.06)", border: "1px solid #ede9e4" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(29,31,36,0.11)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(29,31,36,0.06)"}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-[#f8f7f5]" style={{ aspectRatio: "4/3" }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide" style={{ backgroundColor: "#f06123" }}>
                NEW
              </span>
            )}
            {product.saleLabel && (
              <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1d1f24" }}>
                -{product.saleLabel}
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: "linear-gradient(to top, rgba(29,31,36,0.6) 0%, rgba(29,31,36,0.0) 55%)" }}
          >
            <button
              type="button"
              className="flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: "#f06123" }}
              onClick={(e) => e.preventDefault()}
            >
              <CartIcon />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3.5">
          {/* Category */}
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9ca3af" }}>
            {product.category || "Core Services"}
          </p>

          {/* Title */}
          <p className="text-sm font-semibold leading-snug mb-2" style={{ color: "#1d1f24" }}>
            {product.displayTitle || product.name || product.title}
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= Math.round(product.rating || 4)} />)}
            {product.reviewCount > 0 && <span className="text-[10px] ml-1" style={{ color: "#aaa" }}>({product.reviewCount})</span>}
          </div>

          {/* Divider */}
          <div className="h-px mb-3" style={{ backgroundColor: "#f0ece8" }} />

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold" style={{ color: "#1d1f24" }}>
                ${product.price?.toFixed ? product.price.toFixed(2) : product.price}
              </span>
              {product.oldPrice ? (
                <span className="text-xs line-through" style={{ color: "#bbb" }}>
                  ${product.oldPrice?.toFixed ? product.oldPrice.toFixed(2) : product.oldPrice}
                </span>
              ) : null}
            </div>
            {product.saleLabel ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f0ece8", color: "#888" }}>
                Save {product.saleLabel}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
};
