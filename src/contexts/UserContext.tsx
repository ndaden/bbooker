import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthContextType, User } from "../types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../lib/api/services";

const UserContext = createContext<AuthContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

const QUERY_KEY = ["AUTHENTICATED_USER"];

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const queryClient = useQueryClient();

  // Track authenticated state via localStorage (httpOnly cookie is not accessible to JS)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('auth_state') === 'authenticated';
  });

  // Listen for auth state changes (e.g., from login)
  useEffect(() => {
    const handleAuthStateChange = () => {
      setIsLoggedIn(localStorage.getItem('auth_state') === 'authenticated');
    };
    window.addEventListener('auth-state-change', handleAuthStateChange);
    window.addEventListener('storage', handleAuthStateChange);
    return () => {
      window.removeEventListener('auth-state-change', handleAuthStateChange);
      window.removeEventListener('storage', handleAuthStateChange);
    };
  }, []);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User | null>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authService.getProfile();
        return response.payload || null;
      } catch (err) {
        return null;
      }
    },
    enabled: isLoggedIn, // Only fetch if user logged in
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = async (redirectTo: string = "/") => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem('auth_state');
      window.dispatchEvent(new Event('auth-state-change'));
      await queryClient.removeQueries({ queryKey: QUERY_KEY });
      
      // Validate redirect URL to prevent open redirect attacks
      const allowedDomains = ['localhost:3001', '127.0.0.1:3001'];
      const isValidRedirect = 
        redirectTo.startsWith('/') || 
        allowedDomains.some(domain => redirectTo.includes(domain));
      
      const safeRedirect = isValidRedirect ? redirectTo : "/";
      window.location.href = safeRedirect;
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useAuth must be used within a UserContextProvider");
  }
  return context;
};

export { UserContext, UserContextProvider, useAuth };
