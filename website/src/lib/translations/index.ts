import i18n from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'en';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
	translations: {
		en: { lang },
		zh: { lang }
	},
	loaders: [
		{
			locale: 'en',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'zh',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./zh/home.json')).default
		},
		{
			locale: 'en',
			key: 'meta',
			routes: ['/'],
			loader: async () => (await import('./en/meta.json')).default
		},
		{
			locale: 'zh',
			key: 'meta',
			routes: ['/'],
			loader: async () => (await import('./zh/meta.json')).default
		}
	]
};

export const {
	t,
	loading,
	locales,
	locale,
	loadTranslations,
	addTranslations,
	translations,
	setLocale,
	setRoute
} = new i18n(config);

loading.subscribe(
	($loading) => $loading && console.log('Loading translations for the main instance...')
);
