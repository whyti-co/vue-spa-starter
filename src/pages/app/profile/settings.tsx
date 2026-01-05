import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import GlobeIcon from '@/assets/icons/globe.svg?component';
import MoonIcon from '@/assets/icons/moon.svg?component';
import SunIcon from '@/assets/icons/sun.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import { useTheme } from '@/core/composables/useTheme';
import { type Locale, locales, messages, useI18n } from '@/core/i18n';

const localeLabels: Record<Locale, string> = {
	en: 'English',
	ru: 'Русский',
};

export default defineComponent({
	name: 'SettingsPage',
	setup() {
		const { theme, toggle: toggleTheme } = useTheme();
		const { t, locale, setLocale } = useI18n();

		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => (
							<TopBarTitle title={t(messages.pages.settings.title)} />
						),
						left: { icon: ArrowLeftIcon, to: '/profile' },
					},
					dock: { visible: false },
				}}
			>
				<div class="space-y-4">
					<div class="card bg-base-200">
						<div class="card-body gap-4">
							<h2 class="card-title gap-2">
								<SunIcon class="h-5 w-5" />
								{t(messages.pages.settings.appearance)}
							</h2>
							<div class="form-control">
								<label class="label cursor-pointer justify-between px-0">
									<div class="flex items-center gap-3">
										{theme.value === 'dark' ? (
											<MoonIcon class="h-5 w-5 text-primary" />
										) : (
											<SunIcon class="h-5 w-5 text-warning" />
										)}
										<span class="label-text">
											{t(messages.pages.settings.darkMode)}
										</span>
									</div>
									<input
										type="checkbox"
										class="toggle toggle-primary"
										checked={theme.value === 'dark'}
										onChange={toggleTheme}
									/>
								</label>
							</div>
						</div>
					</div>

					<div class="card bg-base-200">
						<div class="card-body gap-4">
							<h2 class="card-title gap-2">
								<GlobeIcon class="h-5 w-5" />
								{t(messages.pages.settings.language)}
							</h2>
							<div class="form-control">
								<select
									class="select select-bordered"
									value={locale.value}
									onChange={(e) =>
										setLocale((e.target as HTMLSelectElement).value as Locale)
									}
								>
									{locales.map((loc) => (
										<option key={loc} value={loc}>
											{localeLabels[loc]}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>
			</PageWrapper>
		);
	},
});
