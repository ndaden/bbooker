import { ReactNode, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./contexts/UserContext";
import LoadingPage from "./components/LoadingPage";
import React from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const redirectUrl = searchParams.get("redirectUrl") ?? "/login";
        navigate(redirectUrl);
      } else if (user?.role !== "ADMIN") {
        // User is authenticated but not an admin
        navigate("/profile");
      }
    }
  }, [isLoading, isAuthenticated, user, navigate, searchParams]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null; // Return null while redirecting
  }

  return <>{children}</>;
};

export default AdminRoute;
