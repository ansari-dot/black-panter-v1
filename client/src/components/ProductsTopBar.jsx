import React from "react";

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </g>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.43" d="m6 9l6 6l6-6" />
  </svg>
);

export const ProductsTopBar = ({ totalCount, sortOption, onSortChange }) => {
  return (
    <div className="flex items-center justify-between mb-6 font-body flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-3 py-2">
          <span className="text-primary cursor-pointer" style={{ display: "inline-flex", alignItems: "center" }}>
            <GridIcon />
          </span>
          <div className="w-px h-4 bg-border mx-1" />
          <span className="text-muted-foreground cursor-pointer" style={{ display: "inline-flex", alignItems: "center" }}>
            <ListIcon />
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{totalCount}</span> products
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 text-sm">
          <span className="text-muted-foreground text-xs font-medium">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent font-semibold text-foreground text-xs outline-none border-none cursor-pointer pr-1 hover:text-[#F06123] transition-colors"
          >
            <option value="featured" className="bg-white text-neutral-800">Featured</option>
            <option value="priceAsc" className="bg-white text-neutral-800">Price: Low to High</option>
            <option value="priceDesc" className="bg-white text-neutral-800">Price: High to Low</option>
            <option value="rating" className="bg-white text-neutral-800">Highest Rated</option>
            <option value="newest" className="bg-white text-neutral-800">Newest</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground text-xs font-medium">Show:</span>
          <span className="font-semibold text-foreground text-xs">12</span>
        </div>
      </div>
    </div>
  );
};
