import { computed, defineComponent, h, Transition } from 'vue';
import { modalRouter } from './index';

export default defineComponent({
	name: 'ModalRouterView',
	props: {
		transition: {
			type: String,
			default: undefined,
		},
	},
	setup(props) {
		const component = computed(() => {
			const matched = modalRouter.currentRoute.value.matched;
			const lastMatch = matched[matched.length - 1];
			if (!lastMatch) return null;
			return lastMatch.components?.default ?? null;
		});

		const routeKey = computed(() => modalRouter.currentRoute.value.path);

		return () => {
			const content = component.value
				? h('div', { key: routeKey.value }, [h(component.value as any)])
				: null;

			if (props.transition) {
				return h(
					Transition,
					{ name: props.transition, mode: 'out-in' },
					() => content,
				);
			}

			return content;
		};
	},
});
