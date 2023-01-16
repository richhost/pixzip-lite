import React from "react";
import "./aside.scss";

type Props = {
  children?: React.ReactNode;
};

const Aside: React.FC<Props> = ({ children }) => {
  return (
    <aside className="aside">
      <div className="drag">Logo</div>
      <div className="aside-body">{children}</div>
    </aside>
  );
};

export default Aside;
