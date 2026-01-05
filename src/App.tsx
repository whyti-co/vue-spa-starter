import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import ModalDefaultLayout from '@/components/layouts/ModalDefaultLayout';
import Modal from '@/components/Modal';
import { isOpen, useModal } from '@/core/modal';
import ModalRouterView from '@/core/modal/ModalRouterView';

export default defineComponent({
	name: 'App',
	setup() {
		const { close } = useModal();

		return () => (
			<>
				<RouterView />
				<Modal open={isOpen.value} onClose={close}>
					<ModalDefaultLayout>
						<ModalRouterView />
					</ModalDefaultLayout>
				</Modal>
			</>
		);
	},
});
