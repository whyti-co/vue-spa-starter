import { computed, defineComponent, h } from 'vue';
import { modalRouter } from './index';

export default defineComponent({
	name: 'ModalRouterView',
	setup() {
		const component = computed(() => {
			const matched = modalRouter.currentRoute.value.matched;
			const lastMatch = matched[matched.length - 1];
			if (!lastMatch) return null;
			return lastMatch.components?.default ?? null;
		});

		return () => {
			if (!component.value) return null;
			return h(component.value as any);
		};
	},
});
