import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { supabase } from "./lib/supabase";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import Toast from "./components/Toast";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NewDrop from "./pages/NewDrop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new-drop" element={<NewDrop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  // 🔌 Supabase connection test (remove after confirming it works)
  useEffect(() => {
    console.log("🔌 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("❌ Supabase connection error:", error);
      } else {
        console.log("✅ Supabase connected. Session:", data.session);
      }
    });
  }, []);

  // inside App():
  useEffect(() => {
    async function testFetch() {
      console.log("🔌 Testing Supabase...");

      const { data, error } = await supabase
        .from("products")
        .select(`
        id,
        slug,
        name,
        price,
        variants (size, color, color_name, stock)
      `);

      if (error) {
        console.error("❌ Error:", error);
        return;
      }

      console.log("✅ Products fetched:", data);
      console.log(`Found ${data.length} products`);
    }

    testFetch();
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <ScrollToTop />
          <ScrollProgress />
          <CustomCursor />
          <AnnouncementBar />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
          <BackToTop />
          <Toast />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}