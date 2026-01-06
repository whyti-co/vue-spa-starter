import { defineComponent } from 'vue';
import PageWrapper from '@/components/PageWrapper';
import { useModal } from '@/core/modal';
import { getPosts, PostCard } from '@/domains/posts';

export default defineComponent({
	name: 'HomePage',
	setup() {
		const { open } = useModal();
		const posts = getPosts();

		function handlePostClick(id: string) {
			open(`/post/${id}`);
		}

		return () => (
			<PageWrapper>
				<div class="flex items-center justify-center pt-2">
					<div class="flex items-center gap-2 h-10 justify-center">
						<div class="w-8 h-8 rounded-xl bg-base-content flex items-center justify-center">
							<span class="text-base-100 font-bold text-lg">A</span>
						</div>
						<span class="font-semibold text-lg tracking-tight">App</span>
					</div>
				</div>
				<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} onClick={handlePostClick} />
					))}
				</div>
			</PageWrapper>
		);
	},
});
