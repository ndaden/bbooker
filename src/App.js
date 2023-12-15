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
import Business from "./Business";
import Appointment from "./Appointment";

const router = createBrowserRouter([{ path: "*", Component: Root }]);
function App() {
  return (
    <div className="relative min-h-[100vh] flex flex-col dark text-foreground bg-background">
      <QNavbar brandLabel={"Beauty BOOKER"} />
      <RouterProvider router={router} />
      <footer className="w-screen flex items-center justify-center py-3">
        <QLink
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title="Questions homepage"
        >
          <span className="text-default-600">Made with ❤️ by Nabil</span>
        </QLink>
      </footer>
    </div>
  );
}

function Root() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/business/:id" element={<Business />} />
      <Route path="/appointment" element={<Appointment />} />
    </Routes>
  );
}

export default App;