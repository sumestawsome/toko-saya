import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/frontpages/Dashboard";
import Cart from "./pages/frontpages/Cart";
import Checkout from "./pages/frontpages/Checkout";
import ProductDetail from "./pages/frontpages/ProductDetail";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import AboutPage from "./pages/adminpages/AboutPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";

export default function App() {
  return (
    <Routes>
      {/* Rute Autentikasi Pengguna */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Rute Etalase Publik (Frontpage) */}
      <Route path="/" element={<MainLayout />}>
        {/* Rute utama merender halaman Dashboard katalog produk */}
        <Route index element={<Dashboard />} />
        {/* Rute detail produk (dengan parameter slug dan id fallback) */}
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="product/:id" element={<ProductDetail />} />
        {/* Rute keranjang belanja */}
        <Route path="cart" element={<Cart />} />
        {/* Rute checkout pembayaran */}
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Rute Modul Admin (Backpage) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}