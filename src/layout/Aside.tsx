import React from "react";
import "./aside.scss";

type Props = {
  children?: React.ReactNode;
};

const isMacOS = window.lossApi["isMacOS"];

const Aside: React.FC<Props> = ({ children }) => {
  return (
    <aside className="aside">
      <div className="drag">
        {!isMacOS && (
          <div className="brand">
            <img
              srcSet="/icons/win/logo.png 1x, /icons/win/logo@2x.png 2x, /icons/win/logo@3x.png 3x"
              alt="logo"
            />
            像素丢失
          </div>
        )}
      </div>
      <div className="aside-body">{children}</div>
    </aside>
  );
};

export default Aside;
