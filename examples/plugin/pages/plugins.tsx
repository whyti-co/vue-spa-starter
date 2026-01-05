import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import { useModal } from '@/core/modal';
import { usePlugin } from '@/core/plugins';
import type { TExampleExports } from '../exports';

export default defineComponent({
	name: 'PluginsExamplePage',
	setup() {
		const { open } = useModal();
		const { ready, data: example } = usePlugin<TExampleExports>('examples');

		async function openModal() {
			const result = await open<{ message: string }>('/examples/demo-modal');
			if (result) {
				console.log('Modal result:', result.message);
			}
		}

		return () => {
			if (!ready.value || !example.value) {
				return (
					<PageWrapper
						layout={{
							topBar: {
								visible: true,
								title: () => <TopBarTitle title="Plugin System" />,
								left: { icon: ArrowLeftIcon, to: '/examples' },
							},
						}}
					>
						<div class="p-4 flex justify-center">
							<span class="loading loading-spinner loading-lg" />
						</div>
					</PageWrapper>
				);
			}

			const { Counter } = example.value;
			const counter = example.value.useCounter();

			return (
				<PageWrapper
					layout={{
						topBar: {
							visible: true,
							title: () => <TopBarTitle title="Plugin System" />,
							left: { icon: ArrowLeftIcon, to: '/examples' },
						},
					}}
				>
					<div class="p-4 space-y-4">
						<div class="card bg-base-200 p-4">
							<h2 class="font-semibold mb-3">Lazy-loaded Component</h2>
							<Counter />
						</div>

						<div class="card bg-base-200 p-4">
							<h2 class="font-semibold mb-2">Composable State</h2>
							<p class="text-sm">
								Count: {counter.count} (doubled: {counter.doubled})
							</p>
						</div>

						<div class="card bg-base-200 p-4">
							<h2 class="font-semibold mb-3">Plugin Modal</h2>
							<button class="btn btn-primary btn-sm" onClick={openModal}>
								Open Modal
							</button>
						</div>
					</div>
				</PageWrapper>
			);
		};
	},
});
