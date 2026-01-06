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
			<>
				<div class="card bg-base-200 p-4">
					<p class="text-sm text-base-content/70">
						Uses <code class="badge badge-sm">@formatjs/intl</code> directly with
						inline message definitions. Good for standalone components.
					</p>
				</div>
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Locale Switcher</h2>
					<div class="flex gap-2">
						{(Object.keys(messages) as Locale[]).map((loc) => (
							<button
								key={loc}
								class={[
									'btn btn-sm',
									locale.value === loc ? 'btn-primary' : 'btn-outline',
								]}
								onClick={() => setLocale(loc)}
							>
								{loc.toUpperCase()}
							</button>
						))}
					</div>
				</div>
				<div class="card bg-base-200 p-4 space-y-2">
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
			</>
		);
	},
});
