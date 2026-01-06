import { computed, defineComponent, type PropType } from 'vue';
import { type TLayoutConfig, useLayout } from '@/core/composables/useLayout';

export default defineComponent({
	name: 'PageWrapper',
	props: {
		layout: {
			type: Object as PropType<TLayoutConfig>,
			default: () => ({}),
		},
	},
	setup(props, { slots }) {
		// Update shared layout state for TopBar/Dock components
		useLayout(props.layout);

		// Use props directly for padding (not shared state)
		const hasTopBar = props.layout?.topBar?.visible ?? false;
		const hasDock = props.layout?.dock?.visible ?? true;

		// Calculate padding with safe area support
		const style = computed(() => {
			const styles: Record<string, string> = {};

			if (hasTopBar) {
				// 5rem (navbar + fade) + content safe area top
				styles.paddingTop =
					'calc(5rem + var(--content-safe-area-top, env(safe-area-inset-top)))';
			} else {
				// Content safe area top when no topbar
				styles.paddingTop =
					'var(--content-safe-area-top, env(safe-area-inset-top))';
			}

			if (hasDock) {
				// 6rem (dock) + safe area bottom
				styles.paddingBottom =
					'calc(6rem + var(--safe-area-bottom, env(safe-area-inset-bottom)))';
			} else {
				// Just safe area bottom when no dock
				styles.paddingBottom =
					'var(--safe-area-bottom, env(safe-area-inset-bottom))';
			}

			return styles;
		});

		return () => (
			<div class="flex flex-col gap-3 p-4 min-h-full" style={style.value}>
				{slots.default?.()}
			</div>
		);
	},
});
