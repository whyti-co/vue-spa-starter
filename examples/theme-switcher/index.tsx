import { defineComponent } from 'vue';
import { themeModes, useTheme } from '@/core/composables/useTheme';

export default defineComponent({
	name: 'ThemeSwitcherExample',
	setup() {
		const { mode, theme, setMode } = useTheme();

		return () => (
			<>
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Theme Mode</h2>
					<div class="flex flex-wrap gap-2">
						{themeModes.map((opt) => (
							<button
								key={opt.value}
								class={[
									'btn btn-sm',
									mode.value === opt.value ? 'btn-primary' : 'btn-ghost',
								]}
								onClick={() => setMode(opt.value)}
							>
								{opt.label}
							</button>
						))}
					</div>
				</div>
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">Current State</h2>
					<div class="text-sm space-y-1">
						<p>
							Mode: <span class="badge">{mode.value}</span>
						</p>
						<p>
							Resolved theme:{' '}
							<span class="badge badge-primary">{theme.value}</span>
						</p>
					</div>
				</div>
				<div class="card bg-base-200 p-4">
					<p class="text-sm text-base-content/70">
						<strong>System</strong> uses platform theme (Telegram in TMA) or
						browser preference. Theme choice is persisted to localStorage.
					</p>
				</div>
			</>
		);
	},
});
