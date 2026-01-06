import { defineComponent, type PropType } from 'vue';
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

		return () => (
			<div
				class={[
					'flex flex-col gap-3 p-4 min-h-full',
					hasTopBar && 'pt-20',
					hasDock && 'pb-24',
				]}
			>
				{slots.default?.()}
			</div>
		);
	},
});
