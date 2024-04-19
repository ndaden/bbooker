import React, { createContext } from "react";
import useAuthentication from "../hooks/useAuthentication";

const UserContext = createContext({});
const UserContextProvider = ({ children }) => {
  const result = useAuthentication(true);

  return <UserContext.Provider value={result}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };
