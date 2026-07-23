import React from "react";
import { 
  Search, X, SlidersHorizontal, 
  Grid, Settings, Shield, Wrench, Factory, 
  BatteryCharging, Sun, Battery, Phone, HelpCircle, Check
} from "lucide-react";

// Mappings for category icons to give them a premium visual touch
const getCategoryIcon = (name) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("all")) return <Grid className="w-4 h-4" />;
  if (normalized.includes("core")) return <Settings className="w-4 h-4" />;
  if (normalized.includes("field")) return <Wrench className="w-4 h-4" />;
  if (normalized.includes("industrial")) return <Factory className="w-4 h-4" />;
  if (normalized.includes("lithium")) return <BatteryCharging className="w-4 h-4" />;
  if (normalized.includes("solar") || normalized.includes("cycle")) return <Sun className="w-4 h-4" />;
  if (normalized.includes("lead")) return <Battery className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
};

export const ProductSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery = "",
  onSearchChange,
  priceValue = 500,
  onPriceChange,
  stockStatus = "",
  onStockStatusChange,
  onClearFilters
}) => {

  const availabilityOptions = [
    { label: "All Availability", value: "" },
    { label: "In Stock Only", value: "In Stock" },
    { label: "Low Stock Only", value: "Low Stock" },
    { label: "Out of Stock Only", value: "Out of Stock" }
  ];

  // Check if any filter is actively applied to show the "Clear all" button
  const hasActiveFilters = 
    (selectedCategory && selectedCategory !== "All Products") || 
    searchQuery !== "" || 
    priceValue < 500 || 
    stockStatus !== "";

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 font-body bg-white rounded-[24px] p-6 border border-[#ede9e4] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-[#f0ece8]">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-[#F06123] stroke-[2.5]" />
          <p className="text-sm font-extrabold text-[#1d1f24] tracking-tight">Filter Products</p>
        </div>
        {hasActiveFilters && (
          <span
            className="text-xs font-bold text-neutral-450 hover:text-[#F06123] transition-colors cursor-pointer select-none"
            onClick={onClearFilters}
          >
            Clear all
          </span>
        )}
      </div>

      {/* Search Input Filter */}
      <div className="mb-5">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#F06123] transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#f8f7f5] hover:bg-[#f0ece8]/50 focus:bg-white border border-[#ede9e4] focus:border-[#F06123] focus:ring-2 focus:ring-[#F06123]/10 rounded-2xl transition-all duration-300 outline-none placeholder-neutral-400 text-neutral-800 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0ece8] my-5" />

      {/* Categories Section */}
      <div className="mb-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-450 block mb-3">
          Categories
        </span>
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
          {categories?.map((cat, i) => {
            const active = selectedCategory === cat.name;
            return (
              <div
                key={i}
                onClick={() => onCategoryChange?.(cat.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 text-left group relative overflow-hidden select-none ${
                  active 
                    ? "bg-[#1d1f24] text-white shadow-sm shadow-neutral-900/10" 
                    : "text-neutral-600 hover:bg-[#fdf8f5] hover:text-[#F06123]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#F06123]" />
                )}
                <span className="flex items-center gap-2.5 text-xs font-bold tracking-wide">
                  <span className={`transition-transform duration-300 group-hover:scale-110 ${active ? "text-[#F06123]" : "text-neutral-450 group-hover:text-[#F06123]"}`}>
                    {getCategoryIcon(cat.name)}
                  </span>
                  {cat.name}
                </span>
                {cat.count != null && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full transition-all duration-200 ${
                      active 
                        ? "bg-[#F06123] text-white" 
                        : "bg-neutral-100 text-neutral-555 group-hover:bg-[#F06123]/10 group-hover:text-[#F06123]"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0ece8] my-5" />

      {/* Price Range Section */}
      <div className="mb-5">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-450 block mb-3">
          Price Range
        </span>
        <div className="space-y-4 px-1">
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={priceValue}
              onChange={(e) => onPriceChange?.(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#F06123]"
              style={{
                background: `linear-gradient(to right, #F06123 0%, #F06123 ${(priceValue / 500) * 100}%, #f5f5f5 ${(priceValue / 500) * 100}%, #f5f5f5 100%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center bg-[#f8f7f5] px-3.5 py-2.5 rounded-xl border border-[#ede9e4]">
            <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Max Cap</span>
            <span className="text-xs font-black text-neutral-800">${priceValue === 500 ? "500+" : priceValue}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0ece8] my-5" />

      {/* Availability Section */}
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-450 block mb-3">
          Availability
        </span>
        <div className="flex flex-col gap-1.5 px-1">
          {availabilityOptions.map((opt) => {
            const isSelected = stockStatus === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => onStockStatusChange?.(opt.value)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold cursor-pointer transition-all duration-200 border ${
                  isSelected 
                    ? "bg-[#fdf8f5] text-[#F06123] border-[#fbd4c2] shadow-sm shadow-[#F06123]/5" 
                    : "bg-transparent text-neutral-600 border-transparent hover:bg-neutral-50 hover:text-neutral-850"
                }`}
              >
                <span className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all ${
                  isSelected ? "border-[#F06123] bg-[#F06123] text-white" : "border-neutral-300 bg-white"
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3.5]" />}
                </span>
                {opt.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpline Callout Banner */}
      <div className="relative mt-8 rounded-[20px] p-5 text-center overflow-hidden bg-[#1d1f24] border border-neutral-850 shadow-lg">
        {/* Ambient glows */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#F06123]/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-[#FF8803]/8 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center mb-3.5 border border-neutral-800/80 shadow-inner">
            <HelpCircle className="w-5 h-5 text-[#F06123]" />
          </div>
          <p className="text-white font-bold text-xs mb-1 tracking-tight">Need Expert Advice?</p>
          <p className="text-[11px] leading-relaxed mb-4 text-neutral-400 max-w-[170px] mx-auto">
            Talk to our battery specialists for the optimal custom solution.
          </p>
          <a
            href="tel:+61402277723"
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 bg-[#F06123] hover:bg-[#FF8803] text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-500/10"
          >
            <Phone className="w-3.5 h-3.5" /> Call Us Now
          </a>
        </div>
      </div>

    </aside>
  );
};
