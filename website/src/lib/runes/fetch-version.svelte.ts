export function useFetchVersion() {
	const version = $state({
		value: ''
	});
	const date = $state({
		value: ''
	});

	$effect(() => {
		fetch('https://api.github.com/repos/richhost/pixzip-lite/releases/latest').then((resp) => {
			resp.json().then((data) => {
				version.value = data.tag_name.replace('v', '');
				date.value = new Date(data.published_at).toLocaleDateString('en-US', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				});
			});
		});
	});

	return { version, date };
}
