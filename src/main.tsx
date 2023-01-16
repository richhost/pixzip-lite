import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import "the-new-css-reset";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <App />
  </Provider>
);
