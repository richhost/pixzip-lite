import Layout from "@/layout";
import Header from "@/layout/Header";
import Aside from "@/layout/Aside";
import Main from "@/layout/Main";
import SpaceComponent from "@/components/Space";
import FileStage from "@/components/FileStage";

function App() {
  return (
    <Layout>
      <Header></Header>
      <Aside>
        <SpaceComponent />
      </Aside>
      <Main>
        <FileStage />
      </Main>
    </Layout>
  );
}

export default App;
