import { defineComponent, h, type PropType } from 'vue';
import Avatar from '@/components/Avatar';
import type { TPost } from '../api/posts';

export default defineComponent({
	name: 'PostCard',
	props: {
		post: {
			type: Object as PropType<TPost>,
			required: true,
		},
	},
	emits: ['click'],
	setup(props, { emit }) {
		return () => (
			<button
				type="button"
				class="card bg-base-200 break-inside-avoid overflow-hidden cursor-pointer text-left w-full"
				onClick={() => emit('click', props.post.id)}
			>
				<figure>
					<div
						class={`${props.post.height} w-full bg-gradient-to-br ${props.post.gradient} flex items-center justify-center`}
					>
						{h(props.post.icon, { class: 'w-12 h-12 text-base-content/30' })}
					</div>
				</figure>
				<div class="card-body p-3">
					<div class="flex items-center gap-2">
						<Avatar letter={props.post.author[0]} size="sm" />
						<div>
							<p class="text-sm font-medium">{props.post.author}</p>
							<p class="text-xs text-base-content/60">{props.post.title}</p>
						</div>
					</div>
				</div>
			</button>
		);
	},
});
