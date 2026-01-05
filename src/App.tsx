import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import ModalDefaultLayout from '@/components/layouts/ModalDefaultLayout';
import Modal from '@/components/Modal';
import { isDialogMode, useModal } from '@/core/modal';
import ModalRouterView from '@/core/modal/ModalRouterView';

export default defineComponent({
	name: 'App',
	setup() {
		const { close } = useModal();

		return () => (
			<>
				<RouterView />
				{/* Desktop: centered dialog modal */}
				<Modal open={isDialogMode.value} onClose={close}>
					<ModalDefaultLayout>
						<ModalRouterView />
					</ModalDefaultLayout>
				</Modal>
				{/* Mobile: drawer is handled by Dock component */}
			</>
		);
	},
});
