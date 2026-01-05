import {
	createIntl,
	createIntlCache,
	type IntlShape,
	type MessageDescriptor,
} from '@formatjs/intl';
import {
	type App,
	inject,
	type Ref,
	ref,
	type ShallowRef,
	shallowRef,
} from 'vue';

export { messages } from './messages';

export type Locale = 'en' | 'ru';
export const locales: Locale[] = ['en', 'ru'];

const cache = createIntlCache();

const loaders: Record<Locale, () => Promise<Record<string, string>>> = {
	en: () => import('./messages/en.json').then((m) => m.default),
	ru: () => import('./messages/ru.json').then((m) => m.default),
};

type MessageValues = Record<
	string,
	string | number | boolean | Date | null | undefined
>;

interface I18nContext {
	locale: Ref<Locale>;
	intl: ShallowRef<IntlShape<string>>;
	loading: Ref<boolean>;
	setLocale: (locale: Locale) => Promise<void>;
	t: (descriptor: MessageDescriptor, values?: MessageValues) => string;
}

const i18nKey = Symbol('i18n');

let i18nContext: I18nContext | null = null;

const LOCALE_KEY = 'app-locale';

function getSavedLocale(): Locale {
	const saved = localStorage.getItem(LOCALE_KEY);
	return saved && locales.includes(saved as Locale) ? (saved as Locale) : 'en';
}

export async function createI18n(initialLocale?: Locale) {
	const startLocale = initialLocale ?? getSavedLocale();
	const locale = ref<Locale>(startLocale);
	const loading = ref(false);
	const messages = await loaders[startLocale]();

	const intl = shallowRef(
		createIntl({ locale: startLocale, messages, onError: () => {} }, cache),
	);

	const setLocale = async (newLocale: Locale) => {
		if (newLocale === locale.value) return;
		loading.value = true;
		const newMessages = await loaders[newLocale]();
		locale.value = newLocale;
		intl.value = createIntl(
			{ locale: newLocale, messages: newMessages, onError: () => {} },
			cache,
		);
		localStorage.setItem(LOCALE_KEY, newLocale);
		loading.value = false;
	};

	const t = (descriptor: MessageDescriptor, values?: MessageValues) =>
		intl.value.formatMessage(
			descriptor,
			values as Record<string, any>,
		) as string;

	i18nContext = { locale, intl, loading, setLocale, t };

	return {
		install(app: App) {
			app.provide(i18nKey, i18nContext);
		},
	};
}

export function useI18n() {
	const context = inject<I18nContext>(i18nKey);
	if (!context)
		throw new Error('useI18n must be used after i18n plugin is installed');
	return context;
}
