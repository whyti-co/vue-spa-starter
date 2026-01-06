import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import TMAExample from '../../platform/tma';

export default defineComponent({
	name: 'TMAExamplePage',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="TMA Features" />,
						left: { icon: ArrowLeftIcon, to: '/examples/platform' },
					},
				}}
			>
				<TMAExample />
			</PageWrapper>
		);
	},
});
