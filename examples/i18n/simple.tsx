import { createIntl, createIntlCache } from '@formatjs/intl';
import { computed, defineComponent, ref } from 'vue';

const messages = {
	en: {
		greeting: 'Hello, {name}!',
		items:
			'You have {count, plural, =0 {no items} one {# item} other {# items}}.',
		price: 'Total: {amount, number, ::currency/USD}',
		today: 'Today is {date, date, long}',
	},
	ru: {
		greeting: 'Привет, {name}!',
		items:
			'У вас {count, plural, =0 {нет элементов} one {# элемент} few {# элемента} many {# элементов} other {# элементов}}.',
		price: 'Итого: {amount, number, ::currency/RUB}',
		today: 'Сегодня {date, date, long}',
	},
};

type Locale = keyof typeof messages;

const cache = createIntlCache();

export default defineComponent({
	name: 'I18nExample',
	setup() {
		const locale = ref<Locale>('en');

		const intl = computed(() =>
			createIntl(
				{ locale: locale.value, messages: messages[locale.value] },
				cache,
			),
		);

		const setLocale = (newLocale: Locale) => {
			locale.value = newLocale;
		};

		return () => (
			<div class="min-h-screen p-8">
				<h1 class="text-2xl font-bold mb-4">Internationalization (vue-intl)</h1>

				<div class="flex gap-2 mb-6">
					{(Object.keys(messages) as Locale[]).map((loc) => (
						<button
							key={loc}
							class={[
								'btn',
								locale.value === loc ? 'btn-primary' : 'btn-outline',
							]}
							onClick={() => setLocale(loc)}
						>
							{loc.toUpperCase()}
						</button>
					))}
				</div>

				<div class="card bg-base-200 p-6 space-y-2">
					<p>
						{intl.value.formatMessage({ id: 'greeting' }, { name: 'World' })}
					</p>
					<p>{intl.value.formatMessage({ id: 'items' }, { count: 0 })}</p>
					<p>{intl.value.formatMessage({ id: 'items' }, { count: 1 })}</p>
					<p>{intl.value.formatMessage({ id: 'items' }, { count: 5 })}</p>
					<p>{intl.value.formatMessage({ id: 'price' }, { amount: 99.99 })}</p>
					<p>
						{intl.value.formatMessage({ id: 'today' }, { date: new Date() })}
					</p>
				</div>
			</div>
		);
	},
});
