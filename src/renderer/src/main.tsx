import React from "react";
import { createRoot } from "react-dom/client";
import "the-new-css-reset";
import { enableMapSet } from "immer";
import App from "./app";

enableMapSet();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
