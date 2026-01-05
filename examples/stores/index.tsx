import { defineComponent } from 'vue';
import { useCounterStore } from './counter';

export default defineComponent({
	name: 'StoresExample',
	setup() {
		const counter = useCounterStore();

		return () => (
			<div class="min-h-screen p-8">
				<h1 class="text-2xl font-bold mb-6">Pinia Store with Persistence</h1>

				<div class="card bg-base-200 p-6 space-y-4">
					<div class="text-4xl font-bold text-center">{counter.count}</div>
					<div class="text-sm text-center opacity-70">
						Doubled: {counter.doubled}
					</div>

					<div class="flex justify-center gap-2">
						<button class="btn btn-primary" onClick={counter.decrement}>
							-
						</button>
						<button class="btn btn-secondary" onClick={counter.increment}>
							+
						</button>
						<button class="btn btn-ghost" onClick={counter.reset}>
							Reset
						</button>
					</div>

					<p class="text-sm text-center opacity-50">
						Value persists in localStorage. Refresh to verify.
					</p>
				</div>
			</div>
		);
	},
});
