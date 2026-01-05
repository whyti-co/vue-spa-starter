import { defineComponent, ref } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import {
	DefaultLayoutExample,
	TopBarWithTitleExample,
	TopBarOnClickExample,
	HiddenDockExample,
} from '../../layout';

const examples = [
	{ id: 'default', label: 'Default', component: DefaultLayoutExample },
	{ id: 'title', label: 'With Title', component: TopBarWithTitleExample },
	{ id: 'onclick', label: 'onClick', component: TopBarOnClickExample },
	{ id: 'nodock', label: 'No Dock', component: HiddenDockExample },
] as const;

export default defineComponent({
	name: 'LayoutExamplePage',
	setup() {
		const activeTab = ref<string>('default');

		return () => {
			const current = examples.find((e) => e.id === activeTab.value);
			const Component = current?.component ?? DefaultLayoutExample;

			return (
				<PageWrapper
					layout={{
						topBar: {
							visible: true,
							title: () => <TopBarTitle title="Layout System" />,
							left: { icon: ArrowLeftIcon, to: '/examples' },
						},
					}}
				>
					<div class="p-4">
						<div role="tablist" class="tabs tabs-box mb-4">
							{examples.map((ex) => (
								<button
									role="tab"
									class={['tab', activeTab.value === ex.id && 'tab-active']}
									onClick={() => (activeTab.value = ex.id)}
								>
									{ex.label}
								</button>
							))}
						</div>

						<div class="card bg-base-200 p-4">
							<Component />
						</div>
					</div>
				</PageWrapper>
			);
		};
	},
});
