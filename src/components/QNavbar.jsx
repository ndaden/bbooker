import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const QNavbar = ({ brandLabel, links = [] }) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("login");
  };
  const goToSignup = () => {
    navigate("signup");
  };
  const goToProfile = () => {
    navigate("profile");
  };
  return (
    <Navbar>
      <NavbarBrand>
        <a className="font-bold text-inherit" href="/">
          {brandLabel}
        </a>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        {links.map((link) => (
          <NavbarItem isActive={!!link.isActive} key={link.label}>
            <Link
              color={!!link.isActive ? "" : "foreground"}
              href="#"
              aria-current={!!link.isActive ? "page" : ""}
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <Link href="#" onClick={goToProfile}>
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem className="lg:flex">
          <Link href="#" onClick={goToLogin}>
            S'identifier
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="#"
            variant="flat"
            onClick={goToSignup}
          >
            Créer un compte
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default QNavbar;
