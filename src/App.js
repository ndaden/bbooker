import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import QNavbar from "./components/QNavbar";
import QLink from "./components/QLink";

import Appointment from "./containers/appointment/Appointment";
import Login from "./containers/account/Login";
import CreateAccount from "./containers/account/CreateAccount";
import Profile from "./containers/account/Profile";
import CreateBusiness from "./containers/business/CreateBusiness";
import Business from "./containers/business/Business";
import UserContext from "./contexts/UserContext";
import useAuthentication from "./hooks/useAuthentication";
import { useContext } from "react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  const { userData, isLoading, isError } = useAuthentication();
  return (
    <UserContext.Provider value={{ user: { ...userData, isLoading, isError } }}>
      <div className="dark min-h-[100vh] text-foreground bg-background">
        <RouterProvider router={router} />
        <footer className="w-screen flex items-center justify-center py-3">
          <QLink
            isExternal
            className="flex items-center gap-1 text-current"
            href="#"
            title="Beauty booker homepage"
          >
            <span className="text-default-600">BeautyBooker &copy; 2024</span>
          </QLink>
          <span>&nbsp;-&nbsp;</span>
          <QLink
            isExternal
            className="flex items-center gap-1 text-current"
            href="#"
            title="Beauty booker homepage"
          >
            <span className="text-default-600">Conditions d'utilisation</span>
          </QLink>
        </footer>
      </div>
    </UserContext.Provider>
  );
}

const Brand = ({ pro }) => (
  <div className="font-onest text-3xl">
    BeautyBooker
    {pro && (
      <span className="text-medium text-orange-600 font-bold align-text-top capitalize">
        &nbsp;pro <IoShieldCheckmarkOutline className="inline" />
      </span>
    )}
  </div>
);

function Root() {
  const { user } = useContext(UserContext);
  return (
    <>
      <QNavbar brandLabel={<Brand pro />} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/new-business" element={<CreateBusiness />} />
        <Route path="/business/:id" element={<Business />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
