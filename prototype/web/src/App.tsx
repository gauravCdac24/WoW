import type { ReactNode } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PublicLayout } from "./components/PublicLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, homeForRole, useAuth } from "./auth-context";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminZones } from "./pages/AdminZones";
import { FinderAccepted } from "./pages/FinderAccepted";
import { FinderHome } from "./pages/FinderHome";
import { LandingPage } from "./pages/LandingPage";
import { ListerHome } from "./pages/ListerHome";
import { ListerJobs } from "./pages/ListerJobs";
import { LoginPage } from "./pages/LoginPage";
import { ActivityPage } from "./pages/ActivityPage";
import { BookPage } from "./pages/BookPage";
import { BookingsPage } from "./pages/BookingsPage";
import { HelpPage } from "./pages/HelpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ServicesPage } from "./pages/ServicesPage";

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="screen-loader">
        <div className="spinner" /> Loading…
      </div>
    );
  }
  if (user) return <Navigate to={homeForRole(user.role)} replace />;
  return <>{children}</>;
}

function LandingOrRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="screen-loader">
        <div className="spinner" /> Loading…
      </div>
    );
  }
  if (user) return <Navigate to={homeForRole(user.role)} replace />;
  return <LandingPage />;
}

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingOrRedirect />} />
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <LoginPage />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <RegisterPage />
                </PublicOnly>
              }
            />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          <Route
            path="/finder"
            element={
              <ProtectedRoute roles={["finder"]}>
                <FinderHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finder/accepted"
            element={
              <ProtectedRoute roles={["finder"]}>
                <FinderAccepted />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lister"
            element={
              <ProtectedRoute roles={["lister"]}>
                <ListerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lister/jobs"
            element={
              <ProtectedRoute roles={["lister"]}>
                <ListerJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/zones"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminZones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
