import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import WhatsAppFloating from "./components/WhatsAppFloating";

// Lazy loaded components with proper chunk splitting
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const Service = lazy(() => import("./pages/Service").then(module => ({ default: module.Service })));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then(module => ({ default: module.ServiceDetail })));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage").then(module => ({ default: module.ServiceDetailPage })));
const Product = lazy(() => import("./pages/Product").then(module => ({ default: module.Product })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then(module => ({ default: module.ProjectDetailPage })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));

// Loading component
const LoadingSpinner = () => (
  <div className="loading">
    <div style={{ 
      width: '40px', 
      height: '40px', 
      border: '4px solid #f3f3f3', 
      borderTop: '4px solid #F06123', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
    }}></div>
  </div>
);

function App() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Service />} />
          <Route path="/service-detail" element={<ServiceDetail />} />
          <Route path="/service/:slug" element={<ServiceDetailPage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <WhatsAppFloating />
    </div>
  );
}

export default App;
