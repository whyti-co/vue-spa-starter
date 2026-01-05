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

let resolvePromise: ((value: unknown) => void) | null = null;

export function useModal() {
	async function open<T = unknown>(path: string): Promise<T | null> {
		await modalRouter.push(path);
		return new Promise((resolve) => {
			resolvePromise = resolve as (value: unknown) => void;
		}) as Promise<T | null>;
	}

	function close(data?: unknown) {
		modalRouter.push('/');
		steps.set([]);
		resolvePromise?.(data ?? null);
		resolvePromise = null;
	}

	return { isOpen, open, close };
}
