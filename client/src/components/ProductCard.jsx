import React from "react";
import { FaCartPlus } from "react-icons/fa";

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <article className="group relative rounded-lg overflow-hidden bg-card shadow-sm border border-border font-body">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {(product.id % 2 === 0) ? (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
            New
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
            Sale
          </div>
        )}
        <div className="absolute top-3 right-3 bg-foreground text-card text-xs font-bold px-2 py-0.5 rounded-sm">
          -{product.saleLabel || '20%'}
        </div>
        
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="absolute inset-0 flex items-end justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/10 group-hover:opacity-100 pb-4"
          aria-label={`Add ${product.title} to cart`}
        >
          <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#111827] shadow">
            <FaCartPlus className="text-primary" />
            Add to cart
          </span>
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-0.5">
          {product.category || 'Core Services'}
        </p>
        <p className="text-sm font-semibold text-foreground leading-snug truncate">
          {product.displayTitle || product.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-primary">{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">{product.oldPrice}</span>
        </div>
      </div>
    </article>
  );
};
