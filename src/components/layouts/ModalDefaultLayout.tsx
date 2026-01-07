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
						<div class="pt-4">
							<Stepper
								items={steps.items.value}
								currentIndex={steps.currentIndex.value}
							/>
						</div>
					)}
				</Transition>
				{slots.default?.()}
			</div>
		);
	},
});
