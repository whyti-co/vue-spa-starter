import { useMediaQuery } from '@vueuse/core';
import { computed, watch } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useQueue } from '@/core/composables/useQueue';
import { modalRoutes } from './routes';

export const modalRouter = createRouter({
	history: createMemoryHistory(),
	routes: modalRoutes,
});

export const isOpen = computed(
	() => modalRouter.currentRoute.value.path !== '/',
);

// Responsive modal: drawer on mobile, dialog on desktop
const isMobile = useMediaQuery('(max-width: 767px)');
export const isDrawerMode = computed(() => isOpen.value && isMobile.value);
export const isDialogMode = computed(() => isOpen.value && !isMobile.value);

export type TModalStep = {
	id: string;
	path: string;
	label: string;
};

export const steps = useQueue<TModalStep>();

watch(
	() => steps.current.value,
	(step) => {
		if (step && modalRouter.currentRoute.value.path !== step.path) {
			modalRouter.push(step.path);
		}
	},
);

// Map of path -> resolver for promise safety when multiple modals open
const resolvers = new Map<string, (value: unknown) => void>();

export function useModal() {
	async function open<T = unknown>(path: string): Promise<T | null> {
		await modalRouter.push(path);
		return new Promise((resolve) => {
			resolvers.set(path, resolve as (value: unknown) => void);
		}) as Promise<T | null>;
	}

	function close(data?: unknown) {
		modalRouter.push('/');
		steps.set([]);
		// Resolve all pending promises (e.g., login -> TOS -> close should resolve both)
		for (const resolver of resolvers.values()) {
			resolver(data ?? null);
		}
		resolvers.clear();
	}

	return { isOpen, open, close };
}
