import { defineComponent, type PropType } from 'vue';

type TSize = 'sm' | 'md' | 'lg';
type TVariant = 'neutral' | 'primary';

const sizes: Record<TSize, { container: string; text: string }> = {
	sm: { container: 'w-8', text: 'text-xs' },
	md: { container: 'w-12', text: 'text-xl' },
	lg: { container: 'w-16', text: 'text-2xl' },
};

const variants: Record<TVariant, string> = {
	neutral: 'bg-neutral text-neutral-content',
	primary: 'bg-primary text-primary-content',
};

export default defineComponent({
	name: 'Avatar',
	props: {
		letter: { type: String, default: '?' },
		size: { type: String as PropType<TSize>, default: 'md' },
		variant: { type: String as PropType<TVariant>, default: 'neutral' },
	},
	setup(props) {
		return () => (
			<div class="avatar avatar-placeholder">
				<div
					class={[
						sizes[props.size].container,
						variants[props.variant],
						'rounded-full',
					]}
				>
					<span class={[sizes[props.size].text, 'uppercase']}>
						{props.letter}
					</span>
				</div>
			</div>
		);
	},
});
