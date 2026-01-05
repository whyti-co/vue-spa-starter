import { defineComponent, ref } from 'vue';
import { useModal } from '@/core/modal';

export default defineComponent({
	name: 'ExamplePluginModal',
	setup() {
		const { close } = useModal();
		const message = ref('');

		function handleSubmit() {
			close({ message: message.value || 'Hello from plugin modal!' });
		}

		function handleInput(e: Event) {
			message.value = (e.target as HTMLInputElement).value;
		}

		return () => (
			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-2xl font-bold">Example Plugin Modal</h2>
					<p class="text-base-content/70 mt-2">
						This modal is contributed by the example plugin.
					</p>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Message</span>
					</label>
					<input
						type="text"
						class="input input-bordered"
						placeholder="Enter a message..."
						value={message.value}
						onInput={handleInput}
					/>
				</div>

				<button class="btn btn-primary w-full" onClick={handleSubmit}>
					Submit
				</button>
			</div>
		);
	},
});
