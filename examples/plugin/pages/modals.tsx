import { defineComponent, ref } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import { ModalWithRouter, SimpleModal } from '../../modal';

export default defineComponent({
	name: 'ModalsExample',
	setup() {
		const activeTab = ref<'simple' | 'router'>('simple');

		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Modals" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<div class="p-4">
					<div role="tablist" class="tabs tabs-box mb-4">
						<button
							role="tab"
							class={['tab', activeTab.value === 'simple' && 'tab-active']}
							onClick={() => {
								activeTab.value = 'simple';
							}}
						>
							Simple
						</button>
						<button
							role="tab"
							class={['tab', activeTab.value === 'router' && 'tab-active']}
							onClick={() => {
								activeTab.value = 'router';
							}}
						>
							With Router
						</button>
					</div>

					{activeTab.value === 'simple' ? <SimpleModal /> : <ModalWithRouter />}
				</div>
			</PageWrapper>
		);
	},
});
