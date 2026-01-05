import { defineComponent } from 'vue';
import { useCounter } from '../composables/useCounter';

export default defineComponent({
	name: 'PluginExampleCounter',
	setup() {
		const counter = useCounter();

		return () => (
			<div class="flex items-center gap-4">
				<button class="btn btn-circle btn-sm" onClick={counter.decrement}>
					-
				</button>
				<span class="text-xl font-mono min-w-12 text-center">
					{counter.count}
				</span>
				<button class="btn btn-circle btn-sm" onClick={counter.increment}>
					+
				</button>
				<button class="btn btn-ghost btn-sm" onClick={counter.reset}>
					Reset
				</button>
			</div>
		);
	},
});
