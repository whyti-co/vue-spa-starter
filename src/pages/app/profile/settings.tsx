import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import DocumentIcon from '@/assets/icons/document.svg?component';
import GlobeIcon from '@/assets/icons/globe.svg?component';
import SunIcon from '@/assets/icons/sun.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import {
	type TThemeMode,
	themeModes,
	useTheme,
} from '@/core/composables/useTheme';
import { type Locale, locales, messages, useI18n } from '@/core/i18n';
import { useModal } from '@/core/modal';

const localeLabels: Record<Locale, string> = {
	en: 'English',
	ru: 'Русский',
};

export default defineComponent({
	name: 'SettingsPage',
	setup() {
		const { mode, setMode } = useTheme();
		const { t, locale, setLocale } = useI18n();
		const { open } = useModal();

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
								<select
									class="select select-bordered"
									value={mode.value}
									onChange={(e) =>
										setMode((e.target as HTMLSelectElement).value as TThemeMode)
									}
								>
									{themeModes.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
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

					<div class="card bg-base-200">
						<div class="card-body gap-4">
							<h2 class="card-title gap-2">
								<DocumentIcon class="h-5 w-5" />
								{t(messages.pages.settings.legal)}
							</h2>
							<button
								type="button"
								class="btn btn-ghost justify-start"
								onClick={() => open('/tos')}
							>
								{t(messages.pages.settings.termsOfService)}
							</button>
						</div>
					</div>
				</div>
			</PageWrapper>
		);
	},
});
