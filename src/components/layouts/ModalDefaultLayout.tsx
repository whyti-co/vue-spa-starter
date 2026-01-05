import { defineComponent, Transition } from 'vue';
import Stepper from '@/components/Stepper';
import { steps } from '@/core/modal';

export default defineComponent({
	name: 'ModalDefaultLayout',
	setup(_, { slots }) {
		return () => (
			<div class="modal-layout">
				<Transition name="fade">
					{steps.items.value.length > 1 && (
						<Stepper
							items={steps.items.value}
							currentIndex={steps.currentIndex.value}
						/>
					)}
				</Transition>
				<div class="modal-layout-content">{slots.default?.()}</div>
			</div>
		);
	},
});
