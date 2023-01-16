import React from "react";
import "./layout.scss";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header drag">header</header>
      {children}
      <main className="main">main</main>
    </div>
  );
};

export default Layout;
