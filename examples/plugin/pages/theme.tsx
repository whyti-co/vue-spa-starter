import { defineComponent } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import ThemeSwitcher from '../../theme-switcher';

export default defineComponent({
	name: 'ThemeExamplePage',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Theme Switcher" />,
						left: { icon: ArrowLeftIcon, to: '/examples' },
					},
				}}
			>
				<ThemeSwitcher />
			</PageWrapper>
		);
	},
});
