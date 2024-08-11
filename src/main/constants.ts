const imageExtensionArray = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp'];

export const imageExtension: Set<string> = new Set([
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.webp',
	'.avif',
	'.bmp'
]);

export const getImageExtensions = () => {
	return imageExtensionArray.map((element) => element.replaceAll('.', ''));
};
