import { defineMessages } from '@formatjs/intl';

export const messages = defineMessages({
	signIn: { id: 'auth.signIn', defaultMessage: 'Sign In' },
	signOut: { id: 'auth.signOut', defaultMessage: 'Sign Out' },
	email: { id: 'auth.email', defaultMessage: 'Email' },
	password: { id: 'auth.password', defaultMessage: 'Password' },
});

export const errorMessages = defineMessages({
	unknown: { id: 'auth.error.unknown', defaultMessage: 'Login failed' },
	invalid_credentials: {
		id: 'auth.error.invalidCredentials',
		defaultMessage: 'Invalid email or password',
	},
	network_error: {
		id: 'auth.error.networkError',
		defaultMessage: 'Network error. Please try again.',
	},
});
