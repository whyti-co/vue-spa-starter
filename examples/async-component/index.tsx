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
			<div class="card bg-base-200 p-4">
				<h2 class="font-semibold mb-3">Async Component Loading</h2>
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
