import { useEffect } from "react";
import Titlebar from "~/components/titlebar";
import Sidebar from "./components/sidebar";

export default function App() {
  useEffect(() => {
    console.log(window);
  }, []);

  return (
    <div id="app">
      <header id="titlebar" className="drag">
        <Titlebar />
      </header>
      <aside id="sidebar">
        <Sidebar />
      </aside>
      <main id="content"></main>
    </div>
  );
}
