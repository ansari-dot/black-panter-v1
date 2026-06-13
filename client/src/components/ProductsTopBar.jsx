import React from 'react';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';

export const ProductsTopBar = ({ totalCount }) => {
  return (
    <div className="flex items-center justify-between mb-6 font-body">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-md px-3 py-2">
          <LayoutGrid className="w-[15px] h-[15px] text-primary cursor-pointer" />
          <div className="w-px h-4 bg-border"></div>
          <List className="w-[15px] h-[15px] text-muted-foreground cursor-pointer" />
        </div>
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{totalCount}</span> products
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground cursor-pointer">
          <span className="text-muted-foreground text-xs">Sort by:</span>
          <span className="font-medium">Price: low to high</span>
          <ChevronDown className="w-[14px] h-[14px] text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground cursor-pointer">
          <span className="text-muted-foreground text-xs">Show:</span>
          <span className="font-medium">12</span>
          <ChevronDown className="w-[14px] h-[14px] text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
