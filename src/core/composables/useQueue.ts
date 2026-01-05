import { computed, type Ref, ref } from 'vue';

type TQueueItem = { id: string };

export function useQueue<T extends TQueueItem>(initialItems: T[] = []) {
	const items: Ref<T[]> = ref(initialItems) as Ref<T[]>;
	const currentIndex = ref(0);

	const current = computed(() => items.value[currentIndex.value]);
	const length = computed(() => items.value.length);
	const hasNext = computed(() => currentIndex.value < items.value.length - 1);
	const hasPrev = computed(() => currentIndex.value > 0);
	const progress = computed(() => ({
		current: currentIndex.value + 1,
		total: items.value.length,
	}));

	function set(newItems: T[]) {
		items.value = newItems;
		currentIndex.value = 0;
	}

	function insert(item: T, afterId?: string) {
		if (afterId) {
			const idx = items.value.findIndex((i) => i.id === afterId);
			if (idx !== -1) {
				items.value.splice(idx + 1, 0, item);
				return;
			}
		}
		items.value.push(item);
	}

	function remove(id: string) {
		const idx = items.value.findIndex((i) => i.id === id);
		if (idx === -1) return;
		items.value.splice(idx, 1);
		if (currentIndex.value >= items.value.length) {
			currentIndex.value = Math.max(0, items.value.length - 1);
		}
	}

	function next() {
		if (hasNext.value) currentIndex.value++;
	}

	function prev() {
		if (hasPrev.value) currentIndex.value--;
	}

	function goTo(id: string) {
		const idx = items.value.findIndex((i) => i.id === id);
		if (idx !== -1) currentIndex.value = idx;
	}

	function reset() {
		currentIndex.value = 0;
	}

	return {
		items,
		current,
		currentIndex,
		length,
		hasNext,
		hasPrev,
		progress,
		set,
		insert,
		remove,
		next,
		prev,
		goTo,
		reset,
	};
}
