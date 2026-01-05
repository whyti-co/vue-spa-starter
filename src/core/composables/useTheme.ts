import { ref, watchEffect } from 'vue';

type TTheme = 'light' | 'dark';

const theme = ref<TTheme>(
	(localStorage.getItem('theme') as TTheme) ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'),
);

watchEffect(() => {
	document.documentElement.setAttribute('data-theme', theme.value);
	localStorage.setItem('theme', theme.value);
});

export function useTheme() {
	function toggle() {
		theme.value = theme.value === 'light' ? 'dark' : 'light';
	}

	return { theme, toggle };
}
