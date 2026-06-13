import React, { useState } from "react";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/AboutHeroSection";
import Footer from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductSidebar } from "../components/ProductSidebar";
import { ProductsTopBar } from "../components/ProductsTopBar";
import { productData } from "../data/productData";
import  backgroundImage from "../assets/herosections/about.webp";

export const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const categories = [
    { name: "All Products", count: productData.length },
    { name: "Core Services", count: productData.filter(p => p.category === "Core Services").length },
    { name: "Field Support", count: productData.filter(p => p.category === "Field Support").length },
    { name: "Industrial Solutions", count: productData.filter(p => p.category === "Industrial Solutions").length }
  ];

  const filteredProducts = selectedCategory === "All Products" 
    ? productData 
    : productData.filter(p => p.category === selectedCategory);

  return (
    <PageLayout
       heroContent={<HeroSection />}
            vectorBackground={backgroundImage}
  
    >
      <section className="bg-background min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-10 font-body">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="hidden lg:block">
              <ProductSidebar 
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <ProductsTopBar totalCount={filteredProducts.length} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-10 flex items-center justify-center gap-2">
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-sm text-muted-foreground hover:bg-muted">
                  <span className="text-xs font-bold">&lt;</span>
                </div>
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm font-semibold border bg-primary text-primary-foreground border-primary">
                  1
                </div>
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm font-semibold border bg-card text-foreground border-border hover:bg-muted">
                  2
                </div>
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm font-semibold border bg-card text-foreground border-border hover:bg-muted">
                  3
                </div>
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-sm text-muted-foreground hover:bg-muted">
                  <span className="text-xs font-bold">&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PageLayout>
  );
};
