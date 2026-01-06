import { defineComponent, h, Transition } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type TLayoutAction, useLayout } from '@/core/composables/useLayout';

export default defineComponent({
	name: 'TopBar',
	setup() {
		const router = useRouter();
		const route = useRoute();
		const layout = useLayout();

		function handleAction(action: TLayoutAction) {
			if ('to' in action) {
				router.push(action.to);
			} else {
				action.onClick();
			}
		}

		return () => (
			<div
				class="topbar fixed top-0 left-0 right-0 z-50"
				style="padding-top: var(--content-safe-area-top, env(safe-area-inset-top))"
			>
				<div class="navbar container mx-auto">
					<div class="navbar-start">
						{layout.topBar.left && (
							<button
								class="btn btn-ghost btn-sm btn-square"
								onClick={() => {
									if (layout.topBar.left) handleAction(layout.topBar.left);
								}}
							>
								{h(layout.topBar.left.icon, { class: 'h-5 w-5' })}
							</button>
						)}
					</div>
					<div class="navbar-center">
						<Transition name="fade" mode="out-in">
							<div key={route.path}>{layout.topBar.title?.()}</div>
						</Transition>
					</div>
					<div class="navbar-end">
						{layout.topBar.right && (
							<button
								class="btn btn-ghost btn-sm btn-square"
								onClick={() => {
									if (layout.topBar.right) handleAction(layout.topBar.right);
								}}
							>
								{h(layout.topBar.right.icon, { class: 'h-5 w-5' })}
							</button>
						)}
					</div>
				</div>
			</div>
		);
	},
});
