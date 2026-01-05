import { defineComponent } from 'vue';
import Stepper from '@/components/Stepper';
import { steps } from '@/core/modal';

export default defineComponent({
	name: 'ModalDefaultLayout',
	setup(_, { slots }) {
		return () => (
			<div>
				{steps.items.value.length > 1 && (
					<Stepper
						items={steps.items.value}
						currentIndex={steps.currentIndex.value}
					/>
				)}
				{slots.default?.()}
			</div>
		);
	},
});
