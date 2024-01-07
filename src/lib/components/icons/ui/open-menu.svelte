<script lang="ts">
	let { size = 16 } = $props<{ size?: number | string }>();
</script>

<svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M3 3v1h10V3zm0 4v1h10V7zm0 4v1h10v-1z"
		fill="gray"
		overflow="visible"
		style="marker:none"
		color="#000"
	/></svg
>
