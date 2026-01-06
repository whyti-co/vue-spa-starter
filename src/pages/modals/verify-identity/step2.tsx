import { defineComponent } from 'vue';
import DocumentIcon from '@/assets/icons/document.svg?component';
import UploadIcon from '@/assets/icons/upload.svg?component';
import ModalWrapper from '@/components/ModalWrapper';
import { messages, useI18n } from '@/core/i18n';
import { steps, useModal } from '@/core/modal';
import { useSession } from '@/core/session';

export default defineComponent({
	name: 'VerifyIdentityStep2',
	setup() {
		const { close } = useModal();
		const session = useSession();
		const { t } = useI18n();

		function handleBack() {
			steps.prev();
		}

		function handleComplete() {
			session.setVerification({
				fullName: session.user?.name ?? 'Unknown',
				documentType: 'Passport',
				verifiedAt: new Date().toLocaleDateString(),
			});
			close({ success: true });
		}

		return () => (
			<ModalWrapper>
				<div class="text-center">
					<div class="flex justify-center mb-4">
						<div class="bg-primary/10 p-4 rounded-full">
							<DocumentIcon class="h-8 w-8 text-primary" />
						</div>
					</div>
					<h2 class="text-2xl font-bold">
						{t(messages.modals.verifyIdentity.documentUpload)}
					</h2>
					<p class="text-base-content/70 mt-2">
						{t(messages.modals.verifyIdentity.documentUploadDescription)}
					</p>
				</div>
				<div class="border-2 border-dashed border-base-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-base-200 transition-colors">
					<UploadIcon class="h-10 w-10 mx-auto text-base-content/40 mb-3" />
					<p class="font-medium">
						{t(messages.modals.verifyIdentity.clickOrDrag)}
					</p>
					<p class="text-sm text-base-content/50 mt-1">
						{t(messages.modals.verifyIdentity.fileLimit)}
					</p>
				</div>
				<div class="modal-action">
					<button class="btn btn-ghost" onClick={handleBack}>
						{t(messages.actions.back)}
					</button>
					<button class="btn btn-primary" onClick={handleComplete}>
						{t(messages.actions.complete)}
					</button>
				</div>
			</ModalWrapper>
		);
	},
});
