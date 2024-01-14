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

const router = createBrowserRouter([{ path: "*", Component: Root }]);
function App() {
  return (
    <div className="dark min-h-[100vh] text-foreground bg-background">
      <RouterProvider router={router} />
      <footer className="w-screen flex items-center justify-center py-3">
        <QLink
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title="Beauty booker homepage"
        >
          <span className="text-default-600">Made with ❤️ by Nabil</span>
        </QLink>
      </footer>
    </div>
  );
}

const Brand = () => <div className="font-onest text-3xl">BeautyBooker</div>;

function Root() {
  return (
    <>
      <QNavbar brandLabel={<Brand />} />
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
