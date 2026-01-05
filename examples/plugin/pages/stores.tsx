import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import StoresExample from '../../stores';

export default defineComponent({
	name: 'StoresExamplePage',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Pinia Stores" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<StoresExample />
			</PageWrapper>
		);
	},
});
