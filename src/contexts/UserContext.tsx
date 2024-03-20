import React, { createContext } from "react";
import useAuthentication from "../hooks/useAuthentication";

const DEFAULT_USER_CONTEXT = { user: undefined };
const UserContext = createContext(DEFAULT_USER_CONTEXT);

const UserContextProvider = ({ children }) => {
  const { data: userData, isLoading, isError, logout } = useAuthentication();

  return (
    <UserContext.Provider
      value={{
        user: !isLoading && !isError ? userData.payload : undefined,
        error: !isLoading && isError ? userData.message : undefined,
        isLoading,
        isError,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
