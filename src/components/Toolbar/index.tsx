import React from "react";
import Tools from "./Tools";
import WindowController from "./WindowController";
import "./toolbar.scss";

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <Tools />
      <WindowController />
    </div>
  );
};

export default Toolbar;
