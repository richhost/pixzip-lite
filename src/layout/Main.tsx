import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Main: React.FC<Props> = ({ children }) => {
  return <main className="main">{children}</main>;
};

export default Main;
