import ReactDOM from "react-dom/client";
import { Provider } from "jotai";
import App from "./App";
import "./index.less";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <App />
  </Provider>
);
