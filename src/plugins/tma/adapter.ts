import { watch } from 'vue';
import {
	EPlatform,
	type THapticsStyle,
	type TPlatformAdapter,
} from '@/core/platform/types';
import { getColorScheme } from '@/utils';
import {
	authenticateWithBiometry,
	expand,
	hapticFeedback,
	initTMA,
	openBiometrySettings,
	requestBiometryAccess,
	requestBiometryInfo,
	setBackgroundColor,
	setHeaderColor,
	state,
	subscribe,
} from './bridge';

const hapticStyleMap: Record<
	THapticsStyle,
	'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
> = {
	light: 'light',
	medium: 'medium',
	heavy: 'heavy',
	success: 'soft',
	warning: 'rigid',
	error: 'heavy',
};

// Mutable state for biometry (updated during init)
let biometryAvailable = false;
let biometryType: 'fingerprint' | 'face' | 'unknown' | null = null;
let biometryAccessGranted = false;

const adapter: TPlatformAdapter = {
	id: EPlatform.TMA,

	capabilities: {
		haptics: true,
		biometry: true, // Will be verified during init
		themeSync: true,
		cloudStorage: true,
		share: true,
		notifications: false,
	},

	haptics: {
		available: true,
		impact: (style = 'medium') => {
			hapticFeedback('impact', hapticStyleMap[style]);
		},
		notification: (type) => {
			hapticFeedback('notification', type);
		},
		selectionChanged: () => {
			hapticFeedback('selection_change');
		},
	},

	biometry: {
		get available() {
			return biometryAvailable;
		},
		get type() {
			return biometryType;
		},
		get accessGranted() {
			return biometryAccessGranted;
		},
		requestAccess: async (reason) => {
			const granted = await requestBiometryAccess(reason);
			biometryAccessGranted = granted;
			return granted;
		},
		authenticate: async (reason) => {
			const result = await authenticateWithBiometry(reason);
			return result.success;
		},
		openSettings: () => {
			openBiometrySettings();
		},
	},

	themeSync: {
		available: true,
		subscribe: (callback) => {
			// Watch reactive state for theme changes
			const stopWatch = watch(
				state.themeParams,
				() => {
					const bgColor = state.themeParams.value.bg_color;
					if (bgColor) {
						callback(getColorScheme(bgColor));
					}
				},
				{ immediate: true },
			);

			// Also subscribe to theme_changed event for immediate updates
			const unsubscribe = subscribe('theme_changed', () => {
				const bgColor = state.themeParams.value.bg_color;
				if (bgColor) {
					callback(getColorScheme(bgColor));
				}
			});

			return () => {
				stopWatch();
				unsubscribe();
			};
		},
		setHeaderColor: (color) => setHeaderColor(color),
		setBackgroundColor: (color) => setBackgroundColor(color),
	},

	init: async () => {
		// Initialize our TMA bridge
		initTMA();

		// Expand the app
		expand();

		// Request and wait for biometry info
		try {
			const bioInfo = await requestBiometryInfo();
			biometryAvailable = bioInfo.available;
			biometryAccessGranted = bioInfo.access_granted ?? false;
			biometryType =
				bioInfo.type === 'finger'
					? 'fingerprint'
					: bioInfo.type === 'face'
						? 'face'
						: bioInfo.type
							? 'unknown'
							: null;
		} catch {
			// Biometry not available or timed out
			biometryAvailable = false;
			biometryAccessGranted = false;
			biometryType = null;
		}
	},

	destroy: () => {
		// Cleanup handled by Vue's watch/reactive system
	},
};

export default adapter;
