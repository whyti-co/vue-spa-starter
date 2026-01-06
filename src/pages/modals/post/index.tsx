import { computed, defineComponent, h } from 'vue';
import Avatar from '@/components/Avatar';
import ModalWrapper from '@/components/ModalWrapper';
import { modalRouter, useModal } from '@/core/modal';
import { getPostById } from '@/domains/posts';

export default defineComponent({
	name: 'PostModal',
	setup() {
		const { close } = useModal();

		const post = computed(() => {
			const id = modalRouter.currentRoute.value.params.id as string;
			return id ? getPostById(id) : undefined;
		});

		return () => {
			if (!post.value) {
				return (
					<div class="text-center text-base-content/60">Post not found</div>
				);
			}

			const p = post.value;

			return (
				<ModalWrapper fill>
					<div
						class={`${p.height} w-full bg-gradient-to-br ${p.gradient} rounded-2xl flex items-center justify-center`}
					>
						{h(p.icon, { class: 'w-16 h-16 text-base-content/30' })}
					</div>
					<h2 class="text-2xl font-bold">{p.title}</h2>
					<div class="flex items-center gap-2">
						<Avatar letter={p.author[0]} size="sm" />
						<span class="text-sm text-base-content/70">{p.author}</span>
					</div>
					<p class="text-base-content/80 leading-relaxed">{p.description}</p>
					<button
						type="button"
						class="btn btn-primary w-full mt-auto"
						onClick={() => close()}
					>
						Close
					</button>
				</ModalWrapper>
			);
		};
	},
});
