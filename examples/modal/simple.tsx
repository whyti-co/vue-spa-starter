/**
 * Simple Modal Example
 *
 * Basic modal usage without router - just open/close with slots.
 */

import { defineComponent, ref } from 'vue';
import Modal from '@/components/Modal';

export default defineComponent({
	name: 'SimpleModalExample',
	setup() {
		const isOpen = ref(false);
		const result = ref<string | null>(null);

		function openModal() {
			isOpen.value = true;
		}

		function closeModal(value?: string) {
			result.value = value ?? null;
			isOpen.value = false;
		}

		return () => (
			<div class="p-8 space-y-4">
				<h1 class="text-2xl font-bold">Simple Modal</h1>

				<button class="btn btn-primary" onClick={openModal}>
					Open Modal
				</button>

				{result.value && (
					<div class="alert alert-success">Result: {result.value}</div>
				)}

				<Modal open={isOpen.value} onClose={() => closeModal()}>
					<h2 class="text-xl font-bold mb-4">Modal Title</h2>
					<p class="mb-4">This is a simple modal without routing.</p>
					<div class="modal-action">
						<button class="btn" onClick={() => closeModal()}>
							Cancel
						</button>
						<button
							class="btn btn-primary"
							onClick={() => closeModal('confirmed')}
						>
							Confirm
						</button>
					</div>
				</Modal>
			</div>
		);
	},
});
