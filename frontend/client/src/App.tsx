import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ServicesPage } from "./pages/admin/ServicesPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />

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
