import { defineComponent, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const scrollPositions = new Map<string, number>();

export default defineComponent({
	name: 'PageContainer',
	setup(_, { slots }) {
		const route = useRoute();
		const containerRef = ref<HTMLElement | null>(null);

		// Watch route changes to save/restore scroll
		watch(
			() => route.path,
			(newPath, oldPath) => {
				// Save scroll for the page we're leaving
				if (oldPath && containerRef.value) {
					scrollPositions.set(oldPath, containerRef.value.scrollTop);
				}

				// Restore scroll for the page we're entering (only if previously visited)
				const saved = scrollPositions.get(newPath);
				if (saved) {
					nextTick(() => {
						if (containerRef.value) {
							containerRef.value.scrollTop = saved;
						}
					});
				}
			},
			{ flush: 'pre' },
		);

		return () => (
			<div ref={containerRef} class="absolute inset-0 overflow-y-auto">
				<div class="container mx-auto p-4">{slots.default?.()}</div>
			</div>
		);
	},
});
