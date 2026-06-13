import React from 'react';

export const ProductSidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <aside className="w-56 flex-shrink-0 font-body">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Filters</p>
      </div>
      
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Filter By Price</p>
        <div className="relative h-1 rounded-full bg-muted mb-3">
          <div className="absolute left-0 h-1 w-3/5 rounded-full bg-primary"></div>
          <div className="absolute left-3/5 -translate-x-1/2 -top-2 h-5 w-5 rounded-full border-2 border-primary bg-card shadow"></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span><span>$500</span>
        </div>
      </div>
      <div className="mb-5 h-px bg-border"></div>
      
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Categories</p>
        <ul className="space-y-1">
          {categories?.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <li 
                key={idx}
                onClick={() => onCategoryChange?.(cat.name)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${isSelected ? 'bg-secondary text-primary font-semibold' : 'text-foreground hover:bg-muted/50'}`}
              >
                <span>{cat.name}</span>
                <span className={`text-xs ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>({cat.count})</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mb-5 h-px bg-border"></div>
      
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <div key={size} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xs font-semibold border ${size === 'M' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:border-primary'}`}>
              {size}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5 h-px bg-border"></div>
      
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Color</p>
        <div className="space-y-2">
          {[
            { name: 'White', color: '#ffffff', count: 2 },
            { name: 'Orange', color: '#f06123', count: 3 },
            { name: 'Black', color: '#1d1f24', count: 4 },
            { name: 'Gray', color: '#9ca3af', count: 5 }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer">
              <div className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-foreground">{item.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">({item.count})</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-5 h-px bg-border"></div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Top New</p>
        <div className="space-y-3">
          {[
            { name: 'Core Service Pro', price: '$130.45', label: '30%' },
            { name: 'Silver Field Support', price: '$245.00' },
            { name: 'Industrial Pack', price: '$150.50' }
          ].map((item, i) => (
            <div key={i} className="flex gap-2 items-start cursor-pointer">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <img src="https://storage.googleapis.com/banani-generated-images/generated-images/2bcdc1d7-57b9-48c0-ab60-2f1399f16574.jpg" alt={item.name} className="w-full h-full object-cover" />
                {item.label && <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-1">{item.label}</div>}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground leading-tight">{item.name}</p>
                <p className="text-xs text-primary font-semibold mt-0.5">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
