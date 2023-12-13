import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

const QNavbar = ({ brandLabel, links = [] }) => {
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
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default QNavbar;
