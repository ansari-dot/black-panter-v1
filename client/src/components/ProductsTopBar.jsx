import React from "react";
import { SlidersHorizontal } from "lucide-react";

export const ProductsTopBar = ({ totalCount, sortOption, onSortChange, onOpenMobileFilter }) => {
  return (
    <div className="flex items-center justify-between mb-6 font-sans flex-wrap gap-3">
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button with explicit dark orange background and white text */}
        <button
          onClick={onOpenMobileFilter}
          style={{ backgroundColor: "#F06123", color: "#ffffff" }}
          className="lg:hidden inline-flex items-center gap-2 !bg-[#F06123] !text-white px-4 py-2.5 rounded-full text-xs font-extrabold shadow-md border border-[#F06123] hover:!bg-[#FF8803] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
          <span className="text-white font-bold">Filter Products</span>
        </button>

        <span className="text-xs sm:text-sm text-slate-600">
          Showing <span className="font-bold text-slate-900">{totalCount}</span> products
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent font-bold text-slate-800 outline-none border-none cursor-pointer hover:text-[#F06123] transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
};
