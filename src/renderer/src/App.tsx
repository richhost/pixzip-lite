import { AppMain } from "./components/app-main";
import { Layout, Aside, Main } from "./components/layout";
import { Sidebar } from "./components/sidebar";

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
