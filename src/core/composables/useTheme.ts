import { ref, watchEffect } from 'vue';
import { usePlatform, useThemeSync } from '@/core/platform';

export type TThemeMode = 'system' | 'light' | 'dark';
export type TResolvedTheme = 'light' | 'dark' | 'tma';

export const themeModes: { value: TThemeMode; label: string }[] = [
	{ value: 'system', label: 'System' },
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
];

const { isTMA, platform } = usePlatform();

const storedMode = localStorage.getItem('theme-mode') as TThemeMode | null;
const mode = ref<TThemeMode>(storedMode ?? 'system');

function resolveTheme(m: TThemeMode): TResolvedTheme {
	if (m === 'light') return 'light';
	if (m === 'dark') return 'dark';
	if (isTMA()) return 'tma';
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

const theme = ref<TResolvedTheme>(resolveTheme(mode.value));

// Listen for system theme changes
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', () => {
		if (mode.value === 'system') {
			theme.value = resolveTheme('system');
		}
	});

watchEffect(() => {
	// Track platform changes to re-resolve theme when platform is detected
	void platform.value;
	theme.value = resolveTheme(mode.value);
	document.documentElement.setAttribute('data-theme', theme.value);
	localStorage.setItem('theme-mode', mode.value);

	requestAnimationFrame(() => {
		useThemeSync().updatePlatformTheme();
	});
});

export function useTheme() {
	return {
		mode,
		theme,
		setMode: (m: TThemeMode) => {
			mode.value = m;
		},
	};
}
