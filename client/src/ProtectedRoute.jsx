import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === "hr") {
      return <Navigate to="/hr/dashboard" replace />;
    }

    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;