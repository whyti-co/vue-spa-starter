import { EPlatform, type THapticsStyle, type TPlatformAdapter } from '../types';

// Telegram WebApp SDK types
type TTelegramHapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type TTelegramNotificationType = 'error' | 'success' | 'warning';
type TTelegramBiometricType = 'finger' | 'face' | 'unknown';

declare const Telegram: {
	WebApp: {
		ready: () => void;
		expand: () => void;
		close: () => void;
		enableClosingConfirmation: () => void;
		disableClosingConfirmation: () => void;
		isExpanded: boolean;
		viewportHeight: number;
		viewportStableHeight: number;
		HapticFeedback: {
			impactOccurred: (style: TTelegramHapticStyle) => void;
			notificationOccurred: (type: TTelegramNotificationType) => void;
			selectionChanged: () => void;
		};
		BiometricManager: {
			isInited: boolean;
			isBiometricAvailable: boolean;
			biometricType: TTelegramBiometricType;
			init: (callback?: () => void) => void;
			authenticate: (
				params: { reason?: string },
				callback: (success: boolean, token?: string) => void,
			) => void;
		};
		themeParams: {
			bg_color?: string;
			text_color?: string;
			hint_color?: string;
			link_color?: string;
			button_color?: string;
			button_text_color?: string;
			secondary_bg_color?: string;
		};
		colorScheme: 'light' | 'dark';
		onEvent: (event: string, callback: () => void) => void;
		offEvent: (event: string, callback: () => void) => void;
		setHeaderColor: (color: 'bg_color' | 'secondary_bg_color' | string) => void;
		setBackgroundColor: (
			color: 'bg_color' | 'secondary_bg_color' | string,
		) => void;
	};
};

const hapticStyleMap: Record<THapticsStyle, TTelegramHapticStyle> = {
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
			Telegram.WebApp.HapticFeedback.impactOccurred(hapticStyleMap[style]);
		},
		notification: (type) => {
			Telegram.WebApp.HapticFeedback.notificationOccurred(type);
		},
		selectionChanged: () => {
			Telegram.WebApp.HapticFeedback.selectionChanged();
		},
	},

	biometry: {
		get available() {
			return biometryAvailable;
		},
		get type() {
			return biometryType;
		},
		authenticate: async (reason) => {
			return new Promise((resolve) => {
				Telegram.WebApp.BiometricManager.authenticate({ reason }, (success) =>
					resolve(success),
				);
			});
		},
	},

	themeSync: {
		available: true,
		subscribe: (callback) => {
			const handler = () => callback(Telegram.WebApp.colorScheme);
			Telegram.WebApp.onEvent('themeChanged', handler);
			// Initial call
			callback(Telegram.WebApp.colorScheme);
			return () => Telegram.WebApp.offEvent('themeChanged', handler);
		},
		setHeaderColor: (color) => Telegram.WebApp.setHeaderColor(color),
		setBackgroundColor: (color) => Telegram.WebApp.setBackgroundColor(color),
	},

	init: async () => {
		Telegram.WebApp.ready();
		Telegram.WebApp.expand();

		// Initialize biometry
		await new Promise<void>((resolve) => {
			Telegram.WebApp.BiometricManager.init(() => {
				biometryAvailable =
					Telegram.WebApp.BiometricManager.isBiometricAvailable;
				const tgType = Telegram.WebApp.BiometricManager.biometricType;
				biometryType =
					tgType === 'finger'
						? 'fingerprint'
						: tgType === 'face'
							? 'face'
							: tgType === 'unknown'
								? 'unknown'
								: null;
				resolve();
			});
		});
	},

	destroy: () => {
		// Cleanup if needed
	},
};

export default adapter;
