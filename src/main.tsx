import ReactDOM from "react-dom/client";
import "the-new-css-reset";
import { enableMapSet } from "immer";
import App from "./App";
import "./index.scss";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
