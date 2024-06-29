import { locales, loadTranslations, translations, defaultLocale } from '$lib/translations';

export const load = async ({ url, request }) => {
	const { pathname } = url;

	let locale = '';

	// Get user preferred locale
	if (!locale) {
		locale = `${`${request.headers.get('accept-language')}`.match(
			/[a-zA-Z]+?(?=-|_|,|;)/
		)}`.toLowerCase();
	}

	// Get defined locales
	const supportedLocales = locales.get().map((l) => l.toLowerCase());

	// Use default locale if current locale is not supported
	if (!supportedLocales.includes(locale)) {
		locale = defaultLocale;
	}

	await loadTranslations(locale, pathname); // keep this just before the `return`

	return {
		i18n: { locale, route: pathname },
		translations: translations.get() // `translations` on server contain all translations loaded by different clients
	};
};
