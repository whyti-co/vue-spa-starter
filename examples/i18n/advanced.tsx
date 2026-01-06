import { defineComponent } from 'vue';
import { locales, messages, useI18n } from '@/core/i18n';

const LocaleSwitcher = defineComponent({
	name: 'LocaleSwitcher',
	setup() {
		const { locale, loading, setLocale } = useI18n();

		return () => (
			<div class="card bg-base-200 p-4">
				<h2 class="font-semibold mb-3">Locale Switcher</h2>
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
			</div>
		);
	},
});

const Demo = defineComponent({
	name: 'Demo',
	setup() {
		const { t } = useI18n();

		return () => (
			<div class="card bg-base-200 p-4 space-y-2">
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
			<>
				<div class="card bg-base-200 p-4">
					<p class="text-sm text-base-content/70">
						Uses <code class="badge badge-sm">useI18n()</code> composable with
						lazy-loaded locale files and app-wide message definitions.
					</p>
				</div>
				<LocaleSwitcher />
				<Demo />
			</>
		);
	},
});
