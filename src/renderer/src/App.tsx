import { AppMain } from "./components/app-main";
import { Aside, Layout, Main } from "./components/layout";
import { Sidebar } from "./components/sidebar";
import "./hooks/use-task";

function App() {
  return (
    <Layout>
      <Aside>
        <Sidebar />
      </Aside>
      <Main>
        <AppMain />
      </Main>
    </Layout>
  );
}

export default App;
