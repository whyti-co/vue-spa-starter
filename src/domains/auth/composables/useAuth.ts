import { ref } from 'vue';
import { useSession } from '@/core/session';
import {
	login as apiLogin,
	logout as apiLogout,
	fetchCurrentUser,
	type TLoginCredentials,
} from '../api/auth';

export const EAuthError = {
	Unknown: 'unknown',
	InvalidCredentials: 'invalid_credentials',
	NetworkError: 'network_error',
} as const;

export type TAuthError = (typeof EAuthError)[keyof typeof EAuthError];

export function useAuth() {
	const session = useSession();
	const error = ref<TAuthError | null>(null);

	async function login(credentials: TLoginCredentials) {
		session.loading = true;
		error.value = null;

		try {
			const response = await apiLogin(credentials);
			session.setSession(response.user, response.token);
		} catch {
			error.value = EAuthError.Unknown;
			throw error.value;
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
