import { defineComponent, ref } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import { Advanced, Simple } from '../../i18n';

export default defineComponent({
	name: 'I18nExample',
	setup() {
		const activeTab = ref<'simple' | 'advanced'>('simple');

		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="i18n" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<div role="tablist" class="tabs tabs-box">
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
						class={['tab', activeTab.value === 'advanced' && 'tab-active']}
						onClick={() => {
							activeTab.value = 'advanced';
						}}
					>
						Advanced
					</button>
				</div>

				{activeTab.value === 'simple' ? <Simple /> : <Advanced />}
			</PageWrapper>
		);
	},
});
