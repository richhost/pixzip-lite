import Titlebar from "~/components/titlebar";

export default function App() {
  return (
    <div id="app">
      <header id="titlebar" className="drag">
        <Titlebar />
      </header>
      <aside id="sidebar"></aside>
      <main id="content"></main>
    </div>
  );
}
