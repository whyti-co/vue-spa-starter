import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import AsyncComponentExample from '../../async-component';

export default defineComponent({
	name: 'AsyncExamplePage',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Async Components" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<AsyncComponentExample />
			</PageWrapper>
		);
	},
});
