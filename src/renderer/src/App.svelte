<script lang="ts">
	import { LayoutRoot, Sider, Content } from './lib/components/Layout';
	import { Sidebar } from './lib/components/Sidebar';
	import { AppMain } from './lib/components/AppMain';
</script>

<div class="aaa">
	<LayoutRoot>
		<Sider>
			<Sidebar />
		</Sider>
		<Content>
			<AppMain />
		</Content>
	</LayoutRoot>
</div>
