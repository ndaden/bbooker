import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import QNavbar from "./components/QNavbar";
import QLink from "./components/QLink";

import Appointment from "./pages/appointment/Appointment";
import Login from "./pages/account/Login";
import CreateAccount from "./pages/account/CreateAccount";
import Profile from "./pages/account/profile/Profile";
import CreateBusiness from "./pages/business/CreateBusiness";
import CreateBusinessNew from "./pages/business/CreateBusinessNew";
import Business from "./pages/business/Business";
import EditBusiness from "./pages/business/EditBusiness";
import Pricing from "./pages/Pricing";
import LoadingPage from "./components/LoadingPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  return (
    <main className="dark min-h-[100vh] text-foreground bg-background">
      <RouterProvider router={router} />
      <footer className="w-screen flex items-center justify-center py-3">
        <QLink
          isExternal
          classname="flex items-center gap-1 text-current"
          href="#"
          title="Beauty booker homepage"
        >
          <span className="text-default-600">BeautyBooker &copy; 2024</span>
        </QLink>
        <span>&nbsp;-&nbsp;</span>
        <QLink
          isExternal
          classname="flex items-center gap-1 text-current"
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
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route path="/new-business" element={<CreateBusinessNew />} />
        <Route path="/business/:id" element={<Business />} />
        <Route path="/business/:id/edit" element={<EditBusiness />} />
        <Route path="/business/:id/calendar" element={<Business />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/professionnels" element={<Pricing />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/options"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoadingPage />} />
      </Routes>
    </>
  );
}

export default App;
