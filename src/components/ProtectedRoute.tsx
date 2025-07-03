import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};
const defaultAllowedRoles = ["coach", "member", "staff", "admin"];
export default function ProtectedRoute({
  children,
  allowedRoles = defaultAllowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const normalizedUserRole = userRole?.toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (
      !normalizedUserRole ||
      !normalizedAllowed.includes(normalizedUserRole)
    ) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
