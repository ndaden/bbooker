import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <main className="w-full px-6 2xl:max-w-[2000px] 2xl:mx-auto">{children}</main>
);

export default Container;
