import { defineComponent } from 'vue';
import PageWrapper from '@/components/PageWrapper';
import { useModal } from '@/core/modal';
import { usePlugin } from '@/core/plugins';
import type { TExampleExports } from '../exports';

export default defineComponent({
	name: 'ExamplePluginPage',
	setup() {
		const { open } = useModal();
		const { ready, data: example } = usePlugin<TExampleExports>('example');

		async function openModal() {
			const result = await open<{ message: string }>('/example-modal');
			if (result) {
				console.log('Modal result:', result.message);
			}
		}

		return () => {
			if (!ready.value || !example.value) {
				return (
					<PageWrapper>
						<div class="p-4 flex justify-center">
							<span class="loading loading-spinner loading-lg" />
						</div>
					</PageWrapper>
				);
			}

			const { Counter } = example.value;
			const counter = example.value.useCounter();

			return (
				<PageWrapper>
					<div class="p-4 space-y-6">
						<h1 class="text-2xl font-bold">Example Plugin</h1>

						<div class="card bg-base-200 p-4">
							<h2 class="text-lg font-semibold mb-4">Counter Component</h2>
							<Counter />
						</div>

						<div class="card bg-base-200 p-4">
							<h2 class="text-lg font-semibold mb-2">Counter State</h2>
							<p>
								Count: {counter.count} (doubled: {counter.doubled})
							</p>
						</div>

						<div class="card bg-base-200 p-4">
							<h2 class="text-lg font-semibold mb-4">Modal Demo</h2>
							<button class="btn btn-primary" onClick={openModal}>
								Open Plugin Modal
							</button>
						</div>
					</div>
				</PageWrapper>
			);
		};
	},
});
