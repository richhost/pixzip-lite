import React from "react";
import ReactDOM from "react-dom/client";

/** fonts */
import "@fontsource-variable/inter";

import App from "./App.tsx";
import "./app.css";
import "./dot-rolling.css";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
