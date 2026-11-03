import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { MinimizablePlayer } from "./components/MinimizablePlayer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Billing from "./pages/Billing";
import VirtualTrialRoom from "./pages/VirtualTrialRoom";
import OrderTracking from "./pages/OrderTracking";
import BeltBuilder from "./pages/BeltBuilder";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();
  const [currentProductId, setCurrentProductId] = useState<string>();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'product' && pathParts[2]) {
      setCurrentProductId(pathParts[2]);
    } else {
      setCurrentProductId(undefined);
    }
  }, [location]);

  return (
    <>
      <Header />
      <MinimizablePlayer currentProductId={currentProductId} hideOnHero={true} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/trial-room" element={<VirtualTrialRoom />} />
        <Route path="/belt-builder" element={<BeltBuilder />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
