import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ProductHeroSection";
import Footer from "../components/Footer";
import { productsApi, resolveImageUrl } from "../utils/api";
import aboutHeroImage from "../assets/herosections/about.webp";

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let data;
        try {
          // Try getting by slug first
          data = await productsApi.getBySlug(slug);
        } catch (err) {
          // Fallback to getting by ID in case it's an ID
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
        <div className="py-20 text-center text-gray-500 font-body">Loading...</div>
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
        <div className="py-20 text-center text-gray-500 font-body">
          <p className="mb-4">The product you are looking for does not exist or has been removed.</p>
          <Link to="/product" className="inline-block bg-[#f06123] text-white px-6 py-2.5 rounded-lg hover:bg-[#FF8803]">
            Back to Products
          </Link>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  const titleText = product.name || product.title || "Product Detail";
  const line1 = titleText.split(" ").slice(0, 2).join(" ");
  const line2 = titleText.split(" ").slice(2).join(" ");

  const whatsappMessage = product.whatsappMessage || `Hi, I am interested in purchasing ${titleText}. Please provide more details.`;
  const whatsappUrl = `https://wa.me/61402277723?text=${encodeURIComponent(whatsappMessage)}`;
  
  const resolvedImg = resolveImageUrl(product.imageUrl || product.image);

  return (
    <PageLayout
      heroContent={
        <HeroSection />
      }
      vectorBackground={aboutHeroImage}
    >
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 font-body mt-16 md:mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(56,58,60,0.08)] flex items-center justify-center p-4">
            <img src={resolvedImg} alt={titleText} className="max-h-[500px] object-contain w-full rounded-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f06123]">
              {product.category || "Product overview"}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#1d1f24] md:text-5xl">{titleText}</h1>
            
            {product.price && (
              <p className="mt-4 text-2xl font-extrabold text-[#1d1f24]">
                ${product.price.toFixed ? product.price.toFixed(2) : product.price}
                {product.oldPrice && (
                  <span className="text-base font-normal line-through text-gray-400 ml-3">
                    ${product.oldPrice.toFixed ? product.oldPrice.toFixed(2) : product.oldPrice}
                  </span>
                )}
              </p>
            )}

            <p className="mt-5 text-base leading-7 text-[#666666] whitespace-pre-line">{product.description}</p>

            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {product.highlights.map((item) => (
                  <span key={item} className="rounded-full bg-[#f8f2ed] px-4 py-2 text-sm font-medium text-[#8a4b2c]">
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1fb85a]"
              >
                <FaWhatsapp className="text-lg" />
                Buy on WhatsApp
              </a>
              <Link
                to="/product"
                className="inline-flex items-center justify-center rounded-xl border border-[#d8d8d8] px-6 py-3 text-sm font-bold text-[#1d1f24] transition-colors hover:border-[#f06123] hover:text-[#f06123]"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PageLayout>
  );
};
