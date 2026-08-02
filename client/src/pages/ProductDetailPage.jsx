import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ProductHeroSection";
import Footer from "../components/Footer";
import aboutHeroImage from "../assets/herosections/about.webp";
import { productsApi, resolveImageUrl } from "../utils/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m9 18l6-6l-6-6"></path>
  </svg>
);

const IconMessageCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092a10 10 0 1 0-4.777-4.719"></path>
  </svg>
);

const IconShieldCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
      <path d="m9 12l2 2l4-4"></path>
    </g>
  </svg>
);

const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5 5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5 5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
  </svg>
);

const IconThermometer = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
      <path d="m10 20l-1.25-2.5L6 18m4-14L8.75 6.5L6 6m4.585 9H10m-8-3h6.5L10 9m10 5.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"></path>
      <path d="m4 10l1.5 2L4 14m3 7l3-6l-1.5-3M7 3l3 6h2"></path>
    </g>
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
  </svg>
);

const IconTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
      <circle cx="17" cy="18" r="2"></circle>
      <circle cx="7" cy="18" r="2"></circle>
    </g>
  </svg>
);

const IconRotate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2">
      <path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
    </g>
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </g>
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24">
    <path fill="none" stroke="#22c55e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 12l5 5L20 7"></path>
  </svg>
);

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 4h12M9 20a1 1 0 1 1-2 0a1 1 0 0 1 2 0zm11 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"></path>
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const IconMedal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15a4 4 0 1 0 0-8a4 4 0 0 0 0 8zm0 0v6l-3-2l-3 2v-8m12-2l-3-2v-4h-4l-2-3"></path>
  </svg>
);

const IconCar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 16h-4M4 8h16l-1.6 3H5.6L4 8zm0 0l-1.3-3.3A2 2 0 0 1 4.5 2h15a2 2 0 0 1 1.8 2.7L20 8M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M7 16v3m10-3v3"></path>
  </svg>
);

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageUrl, setActiveImageUrl] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showToast, setShowToast] = useState(false);

  const productId = product?._id || product?.id;
  const isWishlisted = isInWishlist(productId);

  const handleWishlistToggle = () => {
    if (productId) {
      toggleWishlist(productId);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setActiveImageUrl(null);
        let data;
        try {
          data = await productsApi.getBySlug(slug);
        } catch (err) {
          data = await productsApi.getById(slug);
        }
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout
        heroContent={
          <div style={{ padding: "40px 0", color: "#fff" }}>
            <p>Loading product details...</p>
          </div>
        }
        vectorBackground={aboutHeroImage}
      >
        <div className="py-20 text-center text-muted-foreground font-body">Loading product details...</div>
        <Footer />
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout
        heroContent={
          <div style={{ padding: "40px 0", color: "#fff" }}>
            <h1 className="text-4xl font-bold">Product Not Found</h1>
          </div>
        }
        vectorBackground={aboutHeroImage}
      >
        <div className="py-20 text-center flex flex-col items-center gap-4 text-muted-foreground font-body">
          <p className="mb-4 text-xl">The product you are looking for does not exist or has been removed.</p>
          <Link to="/product" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Back to Products
          </Link>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  const titleText = product.name || product.title || "Product Detail";
  const resolvedImg = resolveImageUrl(product.imageUrl || product.image);
  
  const category = product.category || "Automotive Batteries";
  
  const defaultHighlights = ["Maintenance Free", "Fast Engine Starting", "High Cold Cranking Power", "Vibration Resistant", "Leak Proof Design", "Suitable for Modern Vehicles"];
  const badges = product.highlights?.length ? product.highlights : defaultHighlights;

  // Dummy related products
  const relatedProducts = [
    { title: "Black Panther AGM 46B24L", price: 189.00, oldPrice: 219.00, img: resolvedImg, tag: "AGM" },
    { title: "Black Panther AGM 75D23L", price: 279.00, oldPrice: 319.00, img: resolvedImg, tag: "AGM" },
    { title: "Black Panther SMF 55B24L", price: 149.00, oldPrice: 179.00, img: resolvedImg, tag: "SMF" },
    { title: "Black Panther EFB 55D23L", price: 219.00, oldPrice: 249.00, img: resolvedImg, tag: "EFB" },
  ];

  return (
    <PageLayout
      heroContent={<HeroSection />}
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background font-body border-b border-border">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 pb-16 pt-8">
          {/* Breadcrumbs */}
          <div className="py-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="flex items-center justify-center w-3 h-3"><IconChevronRight /></span>
            <Link to="/product" className="hover:text-foreground">{category}</Link>
            <span className="flex items-center justify-center w-3 h-3"><IconChevronRight /></span>
            <span className="text-foreground">{titleText}</span>
          </div>

          {/* Product Overview Section */}
          <div className="py-4 flex flex-col lg:flex-row gap-8 items-start mb-8">
            
            {/* Images */}
            <div className="flex flex-col gap-3 w-full lg:w-[500px] shrink-0">
              <div className="bg-surface rounded-xl border border-border overflow-hidden flex items-center justify-center h-[300px] sm:h-[380px]">
                <img src={activeImageUrl || resolvedImg} className="w-full h-full object-contain p-6" alt={titleText} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <div 
                  onClick={() => setActiveImageUrl(null)}
                  className={`w-20 h-20 shrink-0 rounded-lg border-2 bg-surface flex items-center justify-center overflow-hidden cursor-pointer ${!activeImageUrl ? 'border-primary opacity-100' : 'border-border opacity-50 hover:opacity-100'}`}
                >
                  <img src={resolvedImg} className="w-full h-full object-contain p-1" alt="Thumbnail Main" />
                </div>
                {product.gallery?.map((imgUrl, idx) => {
                  const resolvedGalleryImg = resolveImageUrl(imgUrl);
                  return (
                    <div 
                      key={idx}
                      onClick={() => setActiveImageUrl(resolvedGalleryImg)}
                      className={`w-20 h-20 shrink-0 rounded-lg border-2 bg-surface flex items-center justify-center overflow-hidden cursor-pointer ${activeImageUrl === resolvedGalleryImg ? 'border-primary opacity-100' : 'border-border opacity-50 hover:opacity-100'}`}
                    >
                      <img src={resolvedGalleryImg} className="w-full h-full object-contain p-1" alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-accent font-body">
                  {category}
                </span>
                <span className="bg-green/10 text-green text-xs font-semibold px-2 py-0.5 rounded font-body">
                  In Stock
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {titleText}
              </h1>
              
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <span className="text-stars text-sm">★</span>
                  <span className="text-stars text-sm">★</span>
                  <span className="text-stars text-sm">★</span>
                  <span className="text-stars text-sm">★</span>
                  <span className="text-stars text-sm">★</span>
                </div>
                <span className="text-sm text-muted-foreground font-body">(128 reviews)</span>
              </div>

              {product.price && (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">
                    ${product.price.toFixed ? product.price.toFixed(2) : product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-lg text-muted-foreground line-through font-body">
                      ${product.oldPrice.toFixed ? product.oldPrice.toFixed(2) : product.oldPrice}
                    </span>
                  )}
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="bg-tag-bg text-tag-text text-sm font-bold px-2 py-0.5 rounded font-body">
                      Save ${(product.oldPrice - product.price).toFixed(0)}
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-[560px] whitespace-pre-line">
                {product.description || "Engineered for drivers who demand dependable starting power, long-lasting durability, and maintenance-free performance. Built with advanced AGM technology, delivering exceptional cold-cranking power, superior vibration resistance, and faster recharge capability."}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-body font-semibold bg-tag-bg text-tag-text border border-tag-text/20">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
                  <span className="text-primary flex items-center justify-center shrink-0 w-4 h-4"><IconShieldCheck /></span>
                  <span className="text-xs font-semibold text-foreground font-body">36 Month Warranty</span>
                </div>
                <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
                  <span className="text-primary flex items-center justify-center shrink-0 w-4 h-4"><IconZap /></span>
                  <span className="text-xs font-semibold text-foreground font-body">AGM Technology</span>
                </div>
                <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
                  <span className="text-primary flex items-center justify-center shrink-0 w-4 h-4"><IconThermometer /></span>
                  <span className="text-xs font-semibold text-foreground font-body">Cold Crank Ready</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-surface justify-between sm:justify-start">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-foreground font-bold text-base hover:bg-input"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 text-sm font-semibold font-body border-x border-border min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-foreground font-bold text-base hover:bg-input"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#f06123] hover:bg-[#d55219] text-white text-sm font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors relative"
                >
                  <span className="flex items-center justify-center shrink-0 w-4 h-4"><IconCart /></span>
                  Add to Cart
                  {showToast && (
                    <div className="absolute -top-12 bg-green-500 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                      Added to cart!
                    </div>
                  )}
                </button>
                <Link to="/product" className="px-5 py-3 border border-border rounded-lg text-sm font-semibold text-foreground font-body bg-surface text-center hover:bg-input">
                  Back to Products
                </Link>
                {user && (
                  <button 
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`w-[46px] h-[46px] border rounded-lg flex items-center justify-center transition-all ${
                      isWishlisted 
                        ? 'border-[#F06123] bg-[#F06123] text-white shadow-md shadow-[#F06123]/20' 
                        : 'border-border bg-surface hover:bg-input text-muted-foreground hover:text-[#F06123]'
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-lg text-white" />
                    ) : (
                      <FaRegHeart className="text-lg" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-input rounded-lg p-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground flex items-center justify-center shrink-0 w-[15px] h-[15px]"><IconTruck /></span>
                  <span className="text-xs text-muted-foreground font-body">Free delivery over $200</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground flex items-center justify-center shrink-0 w-[15px] h-[15px]"><IconRotate /></span>
                  <span className="text-xs text-muted-foreground font-body">30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground flex items-center justify-center shrink-0 w-[15px] h-[15px]"><IconLock /></span>
                  <span className="text-xs text-muted-foreground font-body">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications & Warranty Section */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6">
            <div className="bg-surface rounded-xl border border-border p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-muted-foreground"><IconSettings /></span>
                Technical Specifications
              </h2>
              <div className="flex flex-col">
                {(() => {
                  const fixedSpecs = [
                    ['Manufacturer', product.manufacturer],
                    ['Chemistry', product.chemistrType],
                    ['Voltage', product.voltage],
                    ['Capacity', product.capacity],
                    ['No. of Cells', product.cells],
                    ['Cycle Life', product.cycleLife],
                    ['IP Rating', product.ipRating],
                    ['Dimensions', product.dimensions],
                    ['Weight', product.weight],
                    ['Operating Temp', product.operatingTemp],
                  ].filter(([, v]) => v);
                  const dynamicSpecs = product.technicalSpecs || [];
                  const allSpecs = [
                    ...fixedSpecs.map(([label, value]) => ({ label, value })),
                    ...dynamicSpecs,
                  ];
                  return allSpecs.length > 0 ? (
                    allSpecs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-3 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{spec.label}</span>
                        <span className="text-sm font-semibold text-foreground">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-3 text-sm text-muted-foreground italic">No technical specifications provided.</div>
                  );
                })()}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-tag-bg flex items-center justify-center text-tag-text shrink-0">
                    <IconMedal />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">36 Month Warranty</h3>
                    <p className="text-xs text-muted-foreground mb-3">Full manufacturer coverage</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Covered against manufacturing defects and premature failure. Warranty serviced at all authorised dealers Australia-wide.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-input flex items-center justify-center text-foreground shrink-0">
                    <IconCar />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mt-2">Compatible Vehicles</h3>
                  </div>
                </div>
                <ul className="flex flex-col gap-2 mb-4">
                  {product.compatibleVehicles?.length > 0 ? (
                    product.compatibleVehicles.map((vehicle, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-0.5"><IconCheck /></span> {vehicle}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-muted-foreground italic">Universal compatibility or not specified.</li>
                  )}
                </ul>
                <Link to="#" className="text-xs font-semibold text-primary hover:underline">
                  View full compatibility list &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-surface font-body border-b border-border">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-foreground">4.7</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5 mb-1">
                      <span className="text-stars text-sm">★</span>
                      <span className="text-stars text-sm">★</span>
                      <span className="text-stars text-sm">★</span>
                      <span className="text-stars text-sm">★</span>
                      <span className="text-stars text-sm">½</span>
                    </div>
                    <span className="text-xs text-muted-foreground">(128 reviews)</span>
                    <span className="text-xs text-muted-foreground">Based on 128 verified purchases</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col gap-1 w-32 border-l border-border pl-6">
                  {[
                    { stars: 5, pct: 72 },
                    { stars: 4, pct: 31 },
                    { stars: 3, pct: 14 },
                    { stars: 2, pct: 6 },
                    { stars: 1, pct: 5 }
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-4">{row.stars}★</span>
                      <div className="h-1.5 flex-1 bg-input rounded-full overflow-hidden">
                        <div className="h-full bg-stars" style={{ width: `${row.pct}%` }}></div>
                      </div>
                      <span className="w-6 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="px-5 py-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-input">
              Write a Review
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 1, initial: 'J', name: 'James K.', date: 'March 2025', text: 'Excellent battery — started my car instantly in -5°C. Fits perfectly and no leaks whatsoever.' },
              { id: 2, initial: 'S', name: 'Sarah M.', date: 'February 2025', text: 'Replaced my OEM battery with this. The AGM technology is noticeable — faster starts and holds charge much better.' },
              { id: 3, initial: 'O', name: 'Omar H.', date: 'January 2025', text: 'Great quality battery. Ordered via WhatsApp, delivery was fast. Would have given 5 stars but the terminal caps were missing.' }
            ].map(review => (
              <div key={review.id} className="border border-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-input flex items-center justify-center text-xs font-bold text-foreground">
                      {review.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-stars text-xs">★</span>
                    <span className="text-stars text-xs">★</span>
                    <span className="text-stars text-xs">★</span>
                    <span className="text-stars text-xs">★</span>
                    <span className="text-stars text-xs">★</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-background font-body">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
            <Link to="/product" className="text-sm font-semibold text-primary hover:underline">
              View all batteries &rarr;
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod, idx) => (
              <div key={idx} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col group">
                <div className="p-4 relative">
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <span className="bg-tag-bg text-tag-text text-xs font-bold px-2 py-0.5 rounded">{prod.tag}</span>
                    <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconCart /> Add to Cart
                    </button>
                  </div>
                  <div className="h-40 flex items-center justify-center py-4">
                    <img src={prod.img} alt={prod.title} className="max-h-full object-contain" />
                  </div>
                </div>
                <div className="p-5 border-t border-border flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-2 flex-1">{prod.title}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-foreground">${prod.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through">${prod.oldPrice.toFixed(2)}</span>
                  </div>
                  <Link to="/product" className="text-xs font-semibold text-primary hover:underline">
                    View details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};
