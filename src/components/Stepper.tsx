import { defineComponent, type PropType } from 'vue';

type TStepItem = { id: string; label: string };

export default defineComponent({
	name: 'Stepper',
	props: {
		items: { type: Array as PropType<TStepItem[]>, required: true },
		currentIndex: { type: Number, required: true },
	},
	setup(props) {
		return () => (
			<ul class="steps w-full mb-4">
				{props.items.map((item, idx) => (
					<li
						key={item.id}
						class={['step', idx <= props.currentIndex && 'step-primary']}
					>
						{item.label}
					</li>
				))}
			</ul>
		);
	},
});
