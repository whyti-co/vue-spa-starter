import { defineComponent } from 'vue';
import UserIcon from '@/assets/icons/user.svg?component';
import ModalWrapper from '@/components/ModalWrapper';
import { messages, useI18n } from '@/core/i18n';
import { steps, useModal } from '@/core/modal';

export default defineComponent({
	name: 'VerifyIdentityStep1',
	setup() {
		const { close } = useModal();
		const { t } = useI18n();

		function handleCancel() {
			close();
		}

		function handleContinue() {
			steps.next();
		}

		return () => (
			<ModalWrapper>
				<div class="text-center">
					<div class="flex justify-center mb-4">
						<div class="bg-primary/10 p-4 rounded-full">
							<UserIcon class="h-8 w-8 text-primary" />
						</div>
					</div>
					<h2 class="text-2xl font-bold">
						{t(messages.modals.verifyIdentity.personalInfo)}
					</h2>
					<p class="text-base-content/70 mt-2">
						{t(messages.modals.verifyIdentity.personalInfoDescription)}
					</p>
				</div>
				<label class="floating-label">
					<span>{t(messages.common.fullName)}</span>
					<input
						type="text"
						placeholder="John Doe"
						class="input input-bordered"
					/>
				</label>
				<label class="floating-label">
					<span>{t(messages.modals.verifyIdentity.dateOfBirth)}</span>
					<input type="date" placeholder=" " class="input input-bordered" />
				</label>
				<div class="modal-action">
					<button class="btn btn-ghost" onClick={handleCancel}>
						{t(messages.actions.cancel)}
					</button>
					<button class="btn btn-primary" onClick={handleContinue}>
						{t(messages.actions.continue)}
					</button>
				</div>
			</ModalWrapper>
		);
	},
});
