import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppFloating from "./components/WhatsAppFloating";

// Lazy loaded components
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const Service = lazy(() => import("./pages/Service").then(module => ({ default: module.Service })));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then(module => ({ default: module.ServiceDetail })));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage").then(module => ({ default: module.ServiceDetailPage })));
const Product = lazy(() => import("./pages/Product").then(module => ({ default: module.Product })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage").then(module => ({ default: module.ProjectDetailPage })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));
const CartPage = lazy(() => import("./pages/CartPage").then(module => ({ default: module.CartPage })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./pages/Register").then(module => ({ default: module.Register })));
const SetPassword = lazy(() => import("./pages/SetPassword").then(module => ({ default: module.SetPassword })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(module => ({ default: module.ForgotPassword })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));


const PaymentPage = lazy(() => import("./pages/PaymentPage").then(module => ({ default: module.PaymentPage })));
const Settings = lazy(() => import("./pages/Settings").then(module => ({ default: module.Settings })));
const Orders = lazy(() => import("./pages/Orders").then(module => ({ default: module.Orders })));
const TrackOrder = lazy(() => import("./pages/TrackOrder").then(module => ({ default: module.TrackOrder })));
const Wishlist = lazy(() => import("./pages/Wishlist").then(module => ({ default: module.Wishlist })));
const Quotations = lazy(() => import("./pages/Quotations").then(module => ({ default: module.Quotations })));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage").then(module => ({ default: module.OrderSuccessPage })));


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
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div>
            <ScrollToTop />
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/pay/:id" element={<PaymentPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/orders" element={<Orders />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/quotes" element={<Quotations />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
            <WhatsAppFloating />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
