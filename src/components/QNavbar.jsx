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
  Avatar,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

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

const QNavbar = ({ links = [] }) => {
  const userContext = useContext(UserContext);

  const {
    isLoading,
    isError,
    logout,
    data: { payload: user } = { payload: undefined },
  } = userContext;

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

  const logoutHandler = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar
      maxWidth="full"
      className="2xl:max-w-[2000px] 2xl:mx-auto sm:py-3"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarBrand>
        <a href="/">
          <Brand pro={user?.role === "OWNER"} />
        </a>
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
        {user && (
          <NavbarItem className="hidden lg:flex">
            <Link href="#" onClick={goToProfile}>
              <Avatar
                isBordered
                color="success"
                title="Votre profile"
                size="lg"
                src={
                  user.profile?.profileImage
                    ? user.profile?.profileImage
                    : "https://i.pravatar.cc/150?u=a04258114e29026302d"
                }
              />
            </Link>
          </NavbarItem>
        )}
        {!user && (
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
        {(!user || isError) && (
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
        {user && !isLoading && !isError && (
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
            {user.role === "OWNER" && (
              <NavbarMenuItem>
                <Link
                  color="primary"
                  className="w-full"
                  href="/new-business"
                  size="lg"
                >
                  Créer mon centre
                </Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <Link
                color="danger"
                className="w-full"
                href="#"
                size="lg"
                onClick={logoutHandler}
              >
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
