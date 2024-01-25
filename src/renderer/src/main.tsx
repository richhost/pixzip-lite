import React from "react";
import ReactDOM from "react-dom/client";
import { enableMapSet } from "immer";

/** fonts */
import "@fontsource-variable/inter";

import App from "./App.tsx";
import "./app.css";
import "./dot-rolling.css";

enableMapSet();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
