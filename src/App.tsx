import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "./components/Header";
import { SpotifyPlayer } from "./components/SpotifyPlayer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import VirtualTrialRoom from "./pages/VirtualTrialRoom";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

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
      <SpotifyPlayer currentProductId={currentProductId} hideOnHero={true} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/trial-room" element={<VirtualTrialRoom />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
