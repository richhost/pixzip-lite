import React from "react";
import "./header.scss";

type Props = {
  children?: React.ReactNode;
};

const Header: React.FC<Props> = ({ children }) => {
  return <header className="header drag">{children}</header>;
};

export default Header;
