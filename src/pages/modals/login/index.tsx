import { defineComponent } from 'vue';
import LockIcon from '@/assets/icons/lock.svg?component';
import { messages, useI18n } from '@/core/i18n';
import { modalRouter, useModal } from '@/core/modal';
import { LoginForm } from '@/domains/auth';

export default defineComponent({
	name: 'LoginModal',
	setup() {
		const { close } = useModal();
		const { t } = useI18n();

		function handleSuccess() {
			close({ success: true });
		}

		return () => (
			<div class="space-y-6">
				<div class="text-center">
					<div class="flex justify-center mb-4">
						<div class="bg-primary/10 p-4 rounded-full">
							<LockIcon class="h-8 w-8 text-primary" />
						</div>
					</div>
					<h2 class="text-2xl font-bold">{t(messages.modals.login.title)}</h2>
					<p class="text-base-content/70 mt-2">
						{t(messages.modals.login.description)}
					</p>
				</div>
				<LoginForm onSuccess={handleSuccess} />
				<p class="text-center text-sm text-base-content/60">
					By signing in, you agree to our{' '}
					<button
						type="button"
						class="link link-primary"
						onClick={() => modalRouter.push('/tos')}
					>
						Terms of Service
					</button>
				</p>
			</div>
		);
	},
});
