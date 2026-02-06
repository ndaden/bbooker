import { ReactNode, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./contexts/UserContext";
import LoadingPage from "./components/LoadingPage";
import React from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = searchParams.get("redirectUrl") ?? "/login";
      navigate(redirectUrl);
    }
  }, [isLoading, isAuthenticated, navigate, searchParams]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null; // Return null while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
