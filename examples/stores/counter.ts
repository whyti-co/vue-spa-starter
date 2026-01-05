import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCounterStore = defineStore(
	'counter',
	() => {
		const count = ref(0);

		const doubled = computed(() => count.value * 2);

		function increment() {
			count.value++;
		}

		function decrement() {
			count.value--;
		}

		function reset() {
			count.value = 0;
		}

		return { count, doubled, increment, decrement, reset };
	},
	{
		persist: true,
	},
);
