import React, { createContext, useContext, ReactNode } from "react";
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
