import {
	defineComponent,
	type FunctionalComponent,
	type SVGAttributes,
	Transition,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DocumentIcon from '@/assets/icons/document.svg?component';
import HomeIcon from '@/assets/icons/home.svg?component';
import ProfileIcon from '@/assets/icons/profile.svg?component';
import ModalDefaultLayout from '@/components/layouts/ModalDefaultLayout';
import { isDrawerMode, useModal } from '@/core/modal';
import ModalRouterView from '@/core/modal/ModalRouterView';
import { isPluginReady } from '@/core/plugins';

type TNavItem = {
	path: string;
	label: string;
	icon: FunctionalComponent<SVGAttributes>;
};

export default defineComponent({
	name: 'Dock',
	props: {
		visible: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const router = useRouter();
		const route = useRoute();
		const { close } = useModal();

		const items: TNavItem[] = [
			{ path: '/', label: 'Home', icon: HomeIcon },
			{ path: '/profile', label: 'Profile', icon: ProfileIcon },
			...(isPluginReady('examples')
				? [{ path: '/examples', label: 'Examples', icon: DocumentIcon }]
				: []),
		];

		return () => (
			<>
				{/* Overlay - click to close drawer */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: overlay is decorative backdrop */}
				<div
					role="presentation"
					class={['dock-overlay', isDrawerMode.value && 'dock-overlay-visible']}
					onClick={close}
				/>

				<Transition name="slide-up">
					{props.visible && (
						<div
							class={[
								'dock-container',
								isDrawerMode.value && 'dock-drawer-open',
							]}
						>
							{/* Drawer content - modal pages on mobile */}
							<div class="dock-drawer-content">
								<Transition name="drawer-content">
									{isDrawerMode.value && (
										<div class="dock-drawer-page">
											<ModalDefaultLayout>
												<ModalRouterView transition="drawer-page" />
											</ModalDefaultLayout>
										</div>
									)}
								</Transition>
							</div>

							{/* Dock icons - uses DaisyUI .dock on desktop */}
							<div class="dock dock-icons">
								{items.map((item) => (
									<button
										key={item.path}
										class={route.path === item.path ? 'dock-active' : ''}
										onClick={() => router.push(item.path)}
									>
										<item.icon />
										<span class="dock-label">{item.label}</span>
									</button>
								))}
							</div>
						</div>
					)}
				</Transition>
			</>
		);
	},
});
