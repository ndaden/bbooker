import { Listbox, ListboxItem } from "@nextui-org/react";
import React from "react";

const AccountLeftMenu = ({ logoutHandler, section }) => {
  return (
    <Listbox
      aria-label="Menu"
      variant="bordered"
      color="warning"
      selectionMode="single"
      defaultSelectedKeys={["infos"]}
      selectionBehavior="toggle"
      hideSelectedIcon
    >
      <ListboxItem
        key="infos"
        className={section === "infos" ? "border-orange-400" : ""}
        href="/profile"
      >
        Mes informations
      </ListboxItem>
      <ListboxItem
        key="mes-centres"
        className={section === "mes-centres" ? "border-orange-400" : ""}
        href="/profile/centres"
      >
        Mes centres de services
      </ListboxItem>
      <ListboxItem
        key="options"
        className={section === "options" ? "border-orange-400" : ""}
        href="/profile/options"
      >
        Options
      </ListboxItem>
      <ListboxItem key="logout" color="danger" onClick={logoutHandler}>
        Se deconnecter
      </ListboxItem>
    </Listbox>
  );
};

export default AccountLeftMenu;
