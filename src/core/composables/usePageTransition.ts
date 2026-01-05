import { ref } from 'vue';
import type { Router } from 'vue-router';

const routeDepth: Record<string, number> = {
	'/': 0,
	'/profile': 1,
	'/profile/settings': 2,
};

function getDepth(path: string): number {
	return routeDepth[path] ?? path.split('/').filter(Boolean).length;
}

export type TTransitionDirection = 'slide-left' | 'slide-right' | 'none';

const direction = ref<TTransitionDirection>('none');

export function usePageTransition() {
	return { direction };
}

export function setupPageTransition(router: Router) {
	router.beforeEach((to, from) => {
		const toDepth = getDepth(to.path);
		const fromDepth = getDepth(from.path);

		if (toDepth > fromDepth) {
			direction.value = 'slide-left';
		} else if (toDepth < fromDepth) {
			direction.value = 'slide-right';
		} else {
			direction.value = 'none';
		}
	});
}
