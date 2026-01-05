import type { TUser } from '@/core/session';

export type TLoginCredentials = {
	email: string;
	password: string;
};

export type TAuthResponse = {
	user: TUser;
	token: string;
};

export async function login(
	credentials: TLoginCredentials,
): Promise<TAuthResponse> {
	// TODO: Replace with actual API call
	await new Promise((r) => setTimeout(r, 1000));

	return {
		user: {
			id: '1',
			email: credentials.email,
			name: 'Demo User',
		},
		token: 'demo-token',
	};
}

export async function logout(): Promise<void> {
	await new Promise((r) => setTimeout(r, 500));
}

export async function fetchCurrentUser(): Promise<TUser | null> {
	// TODO: Replace with actual API call
	await new Promise((r) => setTimeout(r, 300));

	return {
		id: '1',
		email: 'demo@example.com',
		name: 'Demo User',
	};
}
