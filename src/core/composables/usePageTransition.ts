import { ref } from 'vue';
import type { Router } from 'vue-router';

function getDepth(path: string): number {
	return path.split('/').filter(Boolean).length;
}

export type TTransitionDirection = 'slide-left' | 'slide-right' | 'none';

const direction = ref<TTransitionDirection>('none');

// Track visited routes for back detection
const historyStack: string[] = [];

export function usePageTransition() {
	return { direction };
}

export function setupPageTransition(router: Router) {
	router.beforeEach((to, from) => {
		const toDepth = getDepth(to.path);
		const fromDepth = getDepth(from.path);

		// Check if navigating back (to a previously visited route)
		const backIndex = historyStack.lastIndexOf(to.path);
		const isBack = backIndex !== -1 && backIndex < historyStack.length - 1;

		if (isBack) {
			// Going back - remove routes after this point
			historyStack.length = backIndex + 1;
			direction.value = 'slide-right';
		} else if (toDepth > fromDepth) {
			// Going deeper
			direction.value = 'slide-left';
		} else if (toDepth < fromDepth) {
			// Going shallower
			direction.value = 'slide-right';
		} else {
			// Same depth, lateral navigation - treat as forward
			direction.value = 'slide-left';
		}

		// Update history (avoid duplicates)
		if (historyStack[historyStack.length - 1] !== to.path) {
			historyStack.push(to.path);
		}
	});
}
