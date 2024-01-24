import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QNavbar = ({ brandLabel, user, links = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <Navbar
      maxWidth="full"
      className="2xl:max-w-[2000px] 2xl:mx-auto"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarBrand>
        <a href="/">{brandLabel}</a>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
        {user && !user.isLoading && !user.isError && (
          <NavbarItem className="hidden lg:flex">
            <Link href="#" onClick={goToProfile}>
              Profile
            </Link>
          </NavbarItem>
        )}
        {user && user.isError && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="#" onClick={goToLogin}>
                S'identifier
              </Link>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
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
          </>
        )}
      </NavbarContent>
      <NavbarMenu className="bg-dark">
        {user && user.isError && (
          <>
            <NavbarMenuItem>
              <Link color="primary" className="w-full" href="/login" size="lg">
                Se connecter
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="primary" className="w-full" href="/signup" size="lg">
                Créer un compte
              </Link>
            </NavbarMenuItem>
          </>
        )}
        {user && !user.isLoading && !user.isError && (
          <>
            <NavbarMenuItem>
              <Link
                color="primary"
                className="w-full"
                href="/profile"
                size="lg"
              >
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="danger" className="w-full" href="#" size="lg">
                Se déconnecter
              </Link>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default QNavbar;
