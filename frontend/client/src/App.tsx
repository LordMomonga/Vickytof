import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ServicesPage } from "./pages/admin/ServicesPage";
import { CartPage } from "./pages/site/CartPage";
import { ExtensionsPage } from "./pages/site/ExtensionsPage";
import { GalleryPage } from "./pages/site/GalleryPage";
import { KitsPage } from "./pages/site/KitsPage";
import { MembersPage } from "./pages/site/MembersPage";
import { ProductsPage } from "./pages/site/ProductsPage";
import { ShopPage } from "./pages/site/ShopPage";
import { StylingToolsPage } from "./pages/site/StylingToolsPage";
import { WholesalePage } from "./pages/site/WholesalePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/styling-tools" element={<StylingToolsPage />} />
        <Route path="/loc-extensions" element={<ExtensionsPage />} />
        <Route path="/kits" element={<KitsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
        <Route path="/members-only" element={<MembersPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
          <Route path="/admin" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/services" element={<ServicesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
