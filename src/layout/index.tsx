import React from "react";
import "./layout.scss";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export default Layout;
