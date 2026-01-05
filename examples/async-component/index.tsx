import { defineAsyncComponent, defineComponent, Suspense } from 'vue';

// Simulates lazy-loaded component with network delay
const AsyncButton = defineAsyncComponent(async () => {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return import('./AsyncButton');
});

export default defineComponent({
	name: 'AsyncComponentExample',
	setup() {
		return () => (
			<div class="p-4">
				<h1 class="text-xl font-bold mb-4">Async Component Loading</h1>
				<Suspense>
					{{
						default: () => <AsyncButton />,
						fallback: () => (
							<span class="loading loading-spinner loading-md"></span>
						),
					}}
				</Suspense>
			</div>
		);
	},
});
