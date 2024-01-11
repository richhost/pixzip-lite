<script lang="ts">
	let { size = 16 } = $props<{ size?: number | string }>();
</script>

<svg
	width={size}
	height={size}
	version="1.1"
	viewBox="0 0 4.2333 4.2333"
	xmlns="http://www.w3.org/2000/svg"
>
	<g
		transform="scale(.26458)"
		color="#000000"
		fill="#808080"
		font-family="sans-serif"
		font-weight="400"
	>
		<path d="m4 6v6h6v-6zm1 1h4v4h-4z" overflow="visible" />
		<path d="m6 4v1h5v5h1v-6z" opacity=".5" overflow="visible" />
	</g>
</svg>
