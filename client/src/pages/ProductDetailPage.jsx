import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { PageLayout } from "../components/PageLayout";
import { HeroSection } from "../components/HeroSections/ServiceDetailHeroSection";
import Footer from "../components/Footer";
import { productData } from "../data/productData";
import homeHeroImage from "../assets/herosections/home.webp";

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = productData.find((item) => item.slug === slug);

  if (!product) {
    return <div className="p-8 text-center">Product not found</div>;
  }

  const whatsappUrl = `https://wa.me/61402277723?text=${encodeURIComponent(product.whatsappMessage)}`;

  return (
    <PageLayout
      heroContent={
        <HeroSection
          badge="Product Detail"
          title={{
            line1: { white: product.title.split(" ").slice(0, 2).join(" "), orange: " " },
            line2: { white: product.title.split(" ").slice(2).join(" "), orange: "" },
          }}
          description={product.subtitle}
          primaryButtonText="Buy on WhatsApp"
          secondaryButtonText="Back to Products"
        />
      }
      vectorBackground={homeHeroImage}
    >
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(56,58,60,0.08)]">
            <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f06123]">Product overview</p>
            <h1 className="mt-3 text-3xl font-bold text-[#1d1f24] md:text-5xl">{product.title}</h1>
            <p className="mt-5 text-base leading-7 text-[#666666]">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.highlights.map((item) => (
                <span key={item} className="rounded-full bg-[#f8f2ed] px-4 py-2 text-sm font-medium text-[#8a4b2c]">
                  {item}
                </span>
              ))}
            </div>

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

