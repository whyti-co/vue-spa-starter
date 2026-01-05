import { ref } from 'vue';
import { useI18n } from '@/core/i18n';
import { useSession } from '@/core/session';
import {
	login as apiLogin,
	logout as apiLogout,
	fetchCurrentUser,
	type TLoginCredentials,
} from '../api/auth';
import { messages } from '../messages';

export function useAuth() {
	const session = useSession();
	const error = ref<string | null>(null);

	async function login(credentials: TLoginCredentials) {
		const { t } = useI18n();
		session.loading = true;
		error.value = null;

		try {
			const response = await apiLogin(credentials);
			session.setSession(response.user, response.token);
		} catch (e) {
			error.value = e instanceof Error ? e.message : t(messages.loginFailed);
			throw e;
		} finally {
			session.loading = false;
		}
	}

	async function logout() {
		session.loading = true;
		try {
			await apiLogout();
			session.clearSession();
		} finally {
			session.loading = false;
		}
	}

	async function init() {
		if (!session.token) return;

		session.loading = true;
		try {
			const user = await fetchCurrentUser();
			if (user) {
				session.user = user;
			} else {
				session.clearSession();
			}
		} finally {
			session.loading = false;
		}
	}

	return {
		error,
		login,
		logout,
		init,
	};
}
