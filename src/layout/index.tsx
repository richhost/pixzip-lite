import React from "react";
import Aside from "./Aside";
import Header from "./Header";

import "./style.less";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen text-sm">
      <Aside />
      <Header />

      <main id="main">{children}</main>
    </div>
  );
};

export default Layout;
