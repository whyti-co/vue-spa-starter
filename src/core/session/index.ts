import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type TVerification = {
	fullName: string;
	documentType: string;
	verifiedAt: string;
};

export type TUser = {
	id: string;
	email: string;
	name: string;
	verification?: TVerification;
};

export const useSession = defineStore(
	'session',
	() => {
		const user = ref<TUser | null>(null);
		const token = ref<string | null>(null);
		const loading = ref(false);

		const isAuthenticated = computed(() => !!user.value && !!token.value);
		const isVerified = computed(() => !!user.value?.verification);

		function setSession(newUser: TUser, newToken: string) {
			user.value = newUser;
			token.value = newToken;
		}

		function setVerification(data: TVerification) {
			if (user.value) {
				user.value.verification = data;
			}
		}

		function clearSession() {
			user.value = null;
			token.value = null;
		}

		return {
			user,
			token,
			loading,
			isAuthenticated,
			isVerified,
			setSession,
			setVerification,
			clearSession,
		};
	},
	{
		persist: {
			pick: ['token', 'user'],
		},
	},
);
