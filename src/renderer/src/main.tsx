import React from "react";
import { createRoot } from "react-dom/client";
import { enableMapSet } from "immer";

import "the-new-css-reset";
import "./index.css";

import App from "./app";

enableMapSet();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
