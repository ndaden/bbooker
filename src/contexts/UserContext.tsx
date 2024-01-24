import { createContext } from "react";

const DEFAULT_USER_CONTEXT = { user: undefined };
const UserContext = createContext(DEFAULT_USER_CONTEXT);

export default UserContext;
