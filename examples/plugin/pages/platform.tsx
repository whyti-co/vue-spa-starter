import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import PlatformExample from '../../platform';

export default defineComponent({
	name: 'PlatformExamplePage',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Platform Features" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<PlatformExample />
			</PageWrapper>
		);
	},
});
