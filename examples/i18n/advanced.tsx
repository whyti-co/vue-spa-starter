import { defineComponent } from 'vue';
import { locales, messages, useI18n } from '@/core/i18n';

const LocaleSwitcher = defineComponent({
	name: 'LocaleSwitcher',
	setup() {
		const { locale, loading, setLocale } = useI18n();

		return () => (
			<div class="flex gap-2 items-center">
				{locales.map((loc) => (
					<button
						key={loc}
						class={[
							'btn btn-sm',
							locale.value === loc ? 'btn-primary' : 'btn-outline',
						]}
						disabled={loading.value}
						onClick={() => setLocale(loc)}
					>
						{loc.toUpperCase()}
					</button>
				))}
				{loading.value && (
					<span class="loading loading-spinner loading-sm"></span>
				)}
			</div>
		);
	},
});

const Demo = defineComponent({
	name: 'Demo',
	setup() {
		const { t } = useI18n();

		return () => (
			<div class="card bg-base-200 p-6 space-y-2">
				<p>{t(messages.examples.greeting, { name: 'World' })}</p>
				<p>{t(messages.examples.items, { count: 0 })}</p>
				<p>{t(messages.examples.items, { count: 1 })}</p>
				<p>{t(messages.examples.items, { count: 5 })}</p>
				<p>{t(messages.examples.price, { amount: 99.99 })}</p>
				<p>{t(messages.examples.today, { date: new Date() })}</p>
			</div>
		);
	},
});

export default defineComponent({
	name: 'I18nAdvancedExample',
	setup() {
		return () => (
			<div class="min-h-screen p-8">
				<div class="flex justify-between items-center mb-6">
					<h1 class="text-2xl font-bold">Internationalization (Advanced)</h1>
					<LocaleSwitcher />
				</div>
				<Demo />
			</div>
		);
	},
});
