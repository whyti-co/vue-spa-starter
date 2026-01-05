import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';

type TExample = {
	path: string;
	title: string;
	description: string;
};

const examples: TExample[] = [
	{
		path: '/examples/modals',
		title: 'Modals',
		description: 'Simple modals and multi-step modal flows with router',
	},
	{
		path: '/examples/stores',
		title: 'Pinia Stores',
		description: 'State management with localStorage persistence',
	},
	{
		path: '/examples/i18n',
		title: 'i18n',
		description: 'Internationalization with ICU message format',
	},
	{
		path: '/examples/theme',
		title: 'Theme Switcher',
		description: 'Dark/light mode toggle with system preference',
	},
	{
		path: '/examples/layout',
		title: 'Layout System',
		description: 'TopBar and Dock configuration per page',
	},
	{
		path: '/examples/async',
		title: 'Async Components',
		description: 'Lazy-loaded components with Suspense',
	},
	{
		path: '/examples/platform',
		title: 'Platform Features',
		description: 'Haptics, biometry, and platform detection',
	},
	{
		path: '/examples/plugins',
		title: 'Plugin System',
		description: 'Plugin exports, composables, and modals',
	},
];

export default defineComponent({
	name: 'ExamplesIndex',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Examples" />,
						left: { icon: ArrowLeftIcon, to: '/' },
					},
				}}
			>
				<div class="p-4 space-y-3">
					{examples.map((example) => (
						<RouterLink
							to={example.path}
							class="card bg-base-200 p-4 block hover:bg-base-300 transition-colors"
						>
							<h2 class="font-semibold">{example.title}</h2>
							<p class="text-sm text-base-content/70">{example.description}</p>
						</RouterLink>
					))}
				</div>
			</PageWrapper>
		);
	},
});
