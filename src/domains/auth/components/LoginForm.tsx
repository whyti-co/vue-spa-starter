import { defineComponent, ref } from 'vue';
import EmailIcon from '@/assets/icons/email.svg?component';
import KeyIcon from '@/assets/icons/key.svg?component';
import { useI18n } from '@/core/i18n';
import { useSession } from '@/core/session';
import { type TAuthError, useAuth } from '../composables/useAuth';
import { errorMessages, messages } from '../messages';

export default defineComponent({
	name: 'LoginForm',
	emits: ['success'],
	setup(_, { emit }) {
		const session = useSession();
		const { login, error } = useAuth();
		const { t } = useI18n();

		const email = ref('');
		const password = ref('');

		async function handleSubmit(e: Event) {
			e.preventDefault();
			try {
				await login({ email: email.value, password: password.value });
				emit('success');
			} catch {
				// error is already set in useAuth
			}
		}

		return () => (
			<form onSubmit={handleSubmit} class="space-y-4">
				{error.value && (
					<div class="alert alert-error">
						<span>{t(errorMessages[error.value as TAuthError])}</span>
					</div>
				)}

				<label class="input input-bordered flex items-center gap-2">
					<EmailIcon class="h-4 w-4 opacity-50" />
					<input
						type="email"
						class="grow"
						placeholder={t(messages.email)}
						v-model={email.value}
						required
					/>
				</label>

				<label class="input input-bordered flex items-center gap-2">
					<KeyIcon class="h-4 w-4 opacity-50" />
					<input
						type="password"
						class="grow"
						placeholder={t(messages.password)}
						v-model={password.value}
						required
					/>
				</label>

				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={session.loading}
				>
					{session.loading ? (
						<span class="loading loading-spinner" />
					) : (
						t(messages.signIn)
					)}
				</button>
			</form>
		);
	},
});
