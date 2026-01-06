import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ModalWrapper',
	props: {
		fill: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, { slots }) {
		return () => (
			<div class={['modal-wrapper', props.fill && 'modal-wrapper-fill']}>
				{slots.default?.()}
			</div>
		);
	},
});
