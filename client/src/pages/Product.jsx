import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductSidebar } from "../components/ProductSidebar";
import { ProductsTopBar } from "../components/ProductsTopBar";
import { productsApi } from "../utils/api";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ProductHeroSection";
import productHeroImage from "../assets/herosections/about.webp";
import Footer from "../components/Footer";

const ITEMS_PER_PAGE = 12;

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m15 18l-6-6l6-6" />
  </svg>
);
const ChevronRightPag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m9 18l6-6l-6-6" />
  </svg>
);

export const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Advanced filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [priceValue, setPriceValue] = useState(500);
  const [stockStatus, setStockStatus] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  // Dynamic categories list from API
  const [apiCategories, setApiCategories] = useState([]);

  // Sync category state when URL search param changes
  useEffect(() => {
    const cat = searchParams.get("category") || "All Products";
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  // Load active categories dynamically on mount
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/categories?status=Active`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApiCategories(data.map(c => ({ name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  // Debounce search query changes to prevent API spamming
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products from backend whenever a filter, page, or sort option changes
  useEffect(() => {
    setLoading(true);
    const cat = selectedCategory === 'All Products' ? '' : selectedCategory;
    productsApi.getAll({
      status: 'Active',
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      category: cat || undefined,
      search: debouncedSearchQuery || undefined,
      maxPrice: priceValue < 500 ? priceValue : undefined,
      stockStatus: stockStatus || undefined,
      sort: sortOption !== 'featured' ? sortOption : undefined
    })
      .then(res => {
        setProducts(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentPage, selectedCategory, debouncedSearchQuery, priceValue, stockStatus, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setPriceValue(500);
    setStockStatus("");
    setSortOption("featured");
    searchParams.delete("category");
    setSearchParams(searchParams);
    setSelectedCategory("All Products");
    setCurrentPage(1);
  };

  const categories = [
    { name: "All Products", count: totalCount },
    ...(apiCategories.length > 0 ? apiCategories : [
      { name: "Core Services" },
      { name: "Field Support" },
      { name: "Industrial Solutions" },
      { name: "Lithium Traction" },
      { name: "Solar / Deep Cycle" },
      { name: "Lead-Acid Traction" },
    ])
  ];

  return (
    <PageLayout
      heroContent={<HeroSection />}
      vectorBackground={productHeroImage}
    >
      {/* ── CONTENT ── */}
      <div id="products-catalog-section" className="max-w-screen-xl mx-auto pl-4 lg:pl-0 pr-6 md:pr-12 py-12 mt-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <ProductSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              if (cat === "All Products") {
                searchParams.delete("category");
              } else {
                searchParams.set("category", cat);
              }
              setSearchParams(searchParams);
              setCurrentPage(1);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priceValue={priceValue}
            onPriceChange={(val) => {
              setPriceValue(val);
              setCurrentPage(1);
            }}
            stockStatus={stockStatus}
            onStockStatusChange={(status) => {
              setStockStatus(status);
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
          />

          <div className="flex-1 min-w-0">
            <ProductsTopBar 
              totalCount={totalCount} 
              sortOption={sortOption}
              onSortChange={(val) => {
                setSortOption(val);
                setCurrentPage(1);
              }}
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ aspectRatio: '4/3' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-gray-400">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={{ ...product, id: product._id, title: product.name }} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 font-body">
                <div
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground flex items-center justify-center cursor-pointer hover:bg-muted"
                >
                  <ChevronLeft />
                </div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <div
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg border flex items-center justify-center text-sm font-semibold cursor-pointer ${
                      currentPage === page
                        ? "border-primary text-white"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    }`}
                    style={currentPage === page ? { backgroundColor: "#f06123" } : {}}
                  >
                    {page}
                  </div>
                ))}
                <div
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground flex items-center justify-center cursor-pointer hover:bg-muted"
                >
                  <ChevronRightPag />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};
