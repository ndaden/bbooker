import { Link } from "@nextui-org/react";

const QLink = ({ isExternal, classname, title, href, children }) => {
  return (
    <Link
      isExternal={isExternal}
      className={classname}
      title={title}
      href={href}
    >
      {children}
    </Link>
  );
};

export default QLink;
