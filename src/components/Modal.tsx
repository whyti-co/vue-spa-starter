import { defineComponent, Teleport } from 'vue';

export default defineComponent({
	name: 'Modal',
	props: {
		open: { type: Boolean, default: false },
	},
	emits: ['close'],
	setup(props, { slots, emit }) {
		return () => (
			<Teleport to="body">
				<dialog class={['modal', props.open && 'modal-open']}>
					<div class="modal-box">{slots.default?.()}</div>
					<form method="dialog" class="modal-backdrop">
						<button onClick={() => emit('close')}>close</button>
					</form>
				</dialog>
			</Teleport>
		);
	},
});
