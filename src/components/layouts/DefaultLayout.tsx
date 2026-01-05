import { defineComponent, KeepAlive, Transition } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { provideLayout } from '@/core/composables/useLayout';
import { usePageTransition } from '@/core/composables/usePageTransition';
import { isDrawerMode } from '@/core/modal';
import Dock from './Dock';
import PageContainer from './PageContainer';
import TopBar from './TopBar';

export default defineComponent({
	name: 'DefaultLayout',
	setup() {
		const layout = provideLayout();
		const route = useRoute();
		const { direction } = usePageTransition();

		return () => (
			<div class="min-h-screen bg-base-100 flex flex-col">
				<Transition name="slide-down">
					{layout.topBar.visible && <TopBar />}
				</Transition>
				<main class="flex-1 relative overflow-hidden">
					<RouterView>
						{{
							default: ({ Component }: { Component: any }) =>
								Component && (
									<Transition name={direction.value}>
										<KeepAlive max={10}>
											<PageContainer key={route.path}>
												<Component />
											</PageContainer>
										</KeepAlive>
									</Transition>
								),
						}}
					</RouterView>
				</main>
				<Dock visible={layout.dock.visible || isDrawerMode.value} />
			</div>
		);
	},
});
