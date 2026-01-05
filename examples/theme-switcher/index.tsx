import { defineComponent } from 'vue';
import { useTheme } from '@/core/composables/useTheme';

export default defineComponent({
	name: 'ThemeSwitcherExample',
	setup() {
		const { theme, toggle } = useTheme();

		return () => (
			<div class="min-h-screen p-8">
				<h1 class="text-2xl font-bold mb-4">Theme Switcher</h1>

				<div class="form-control w-fit">
					<label class="label cursor-pointer gap-4">
						<span class="label-text">Dark Mode</span>
						<input
							type="checkbox"
							class="toggle"
							checked={theme.value === 'dark'}
							onChange={toggle}
						/>
					</label>
				</div>

				<div class="mt-8 card bg-base-200 p-6">
					<p class="text-base-content">
						Current theme: <strong>{theme.value}</strong>
					</p>
					<p class="text-base-content/60 text-sm mt-2">
						Theme is persisted to localStorage and respects system preference on
						first load.
					</p>
				</div>
			</div>
		);
	},
});
