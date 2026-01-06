import {
	EPlatform,
	type THapticsStyle,
	type TPlatformAdapter,
} from '@/core/platform/types';

const vibrationPatterns: Record<THapticsStyle, number[]> = {
	light: [10],
	medium: [20],
	heavy: [30],
	success: [10, 50, 10],
	warning: [20, 50, 20],
	error: [30, 50, 30, 50, 30],
};

const hasVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

const adapter: TPlatformAdapter = {
	id: EPlatform.PWA,

	capabilities: {
		haptics: hasVibration,
		biometry: false, // WebAuthn could be added later
		themeSync: false,
		cloudStorage: false,
		share: typeof navigator !== 'undefined' && 'share' in navigator,
		notifications: typeof window !== 'undefined' && 'Notification' in window,
	},

	haptics: {
		available: hasVibration,
		impact: (style = 'medium') => {
			if (hasVibration) {
				navigator.vibrate(vibrationPatterns[style]);
			}
		},
		notification: (type) => {
			if (hasVibration) {
				navigator.vibrate(vibrationPatterns[type]);
			}
		},
		selectionChanged: () => {
			if (hasVibration) {
				navigator.vibrate(5);
			}
		},
	},

	biometry: {
		available: false,
		type: null,
		accessGranted: false,
		requestAccess: async () => false,
		authenticate: async () => false,
		openSettings: () => {},
	},

	themeSync: {
		available: false,
		subscribe: () => () => {},
		updateTheme: () => {},
		getOriginalColors: () => undefined,
	},

	init: async () => {
		// PWA initialization
	},

	destroy: () => {
		// Cleanup
	},
};

export default adapter;
