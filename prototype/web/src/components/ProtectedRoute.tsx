import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../api";
import { homeForRole, useAuth } from "../auth-context";

export function ProtectedRoute({
  roles,
  children,
}: {
  roles?: Role[];
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="screen-loader">
        <div className="spinner" /> Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }
  return <>{children}</>;
}
