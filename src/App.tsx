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

import Appointment from "./pages/appointment/Appointment";
import Login from "./pages/account/Login";
import CreateAccount from "./pages/account/CreateAccount";
import Profile from "./pages/account/Profile";
import CreateBusiness from "./pages/business/CreateBusiness";
import Business from "./pages/business/Business";
import LoadingPage from "./components/LoadingPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  return (
    <main className="dark min-h-[100vh] text-foreground bg-background">
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
    </main>
  );
}

function Root() {
  return (
    <>
      <QNavbar />
      <Routes>
        <Route path="*" element={<LoadingPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/new-business" element={<CreateBusiness />} />
        <Route path="/business/:id" element={<Business />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route
          path="/profile"
          element={<ProtectedRoute container={<Profile section="infos" />} />}
        />
        <Route
          path="/profile/options"
          element={<ProtectedRoute container={<Profile section="options" />} />}
        />
      </Routes>
    </>
  );
}

export default App;
