import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const userStr = localStorage.getItem("user");
    user = userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = user.role || "";
    const isAllowed = allowedRoles.some(
      (role) => role.toLowerCase() === currentRole.toLowerCase()
    );

    if (!isAllowed) {
      if (currentRole.toLowerCase() === "counselor") {
        return <Navigate to="/counselor-dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
