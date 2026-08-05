import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getOnboardingRedirectPath } from "@/utils/onboarding";

function ProtectedRoute({ allowedRoles, requireOnboarding = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireOnboarding) {
    const redirectPath = getOnboardingRedirectPath(user);
    if (redirectPath && location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
