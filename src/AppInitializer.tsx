import { ReactNode } from "react";
import { useAuth } from "./contexts/UserContext";
import LoadingPage from "./components/LoadingPage";

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};
