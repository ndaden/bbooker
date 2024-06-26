import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import LoadingPage from "./components/LoadingPage";
import React from "react";

const ProtectedRoute = ({ container }) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [searchParams] = useSearchParams();

  const { isLoading, data: { payload: user } = { payload: undefined } } =
    userContext;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (user) {
    return container;
  } else {
    navigate(searchParams.get("redirectUrl") ?? "/login");
  }
};

export default ProtectedRoute;
