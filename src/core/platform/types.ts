// Platform identification (const object pattern for erasableSyntaxOnly compatibility)
export const EPlatform = {
	PWA: 'pwa',
	TMA: 'tma', // Telegram Mini App
	Browser: 'browser', // Standard browser fallback
} as const;

export type EPlatform = (typeof EPlatform)[keyof typeof EPlatform];

// Capability flags for type-safe feature checks
export type TPlatformCapabilities = {
	haptics: boolean;
	biometry: boolean;
	themeSync: boolean;
	cloudStorage: boolean;
	share: boolean;
	notifications: boolean;
};

// Haptics API
export type THapticsStyle =
	| 'light'
	| 'medium'
	| 'heavy'
	| 'success'
	| 'warning'
	| 'error';

export type THaptics = {
	available: boolean;
	impact: (style?: THapticsStyle) => void;
	notification: (type: 'success' | 'warning' | 'error') => void;
	selectionChanged: () => void;
};

// Biometry API
export type TBiometryType = 'fingerprint' | 'face' | 'iris' | 'unknown';

export type TBiometry = {
	available: boolean;
	type: TBiometryType | null;
	accessGranted: boolean;
	requestAccess: (reason?: string) => Promise<boolean>;
	authenticate: (reason?: string) => Promise<boolean>;
	openSettings: () => void;
};

// Theme sync API
export type TThemeSync = {
	available: boolean;
	subscribe: (callback: (theme: 'light' | 'dark') => void) => () => void;
	setHeaderColor: (color: string) => void;
	setBackgroundColor: (color: string) => void;
};

// Platform adapter interface - each platform implements this
export type TPlatformAdapter = {
	id: EPlatform;
	capabilities: TPlatformCapabilities;
	haptics: THaptics;
	biometry: TBiometry;
	themeSync: TThemeSync;
	init: () => Promise<void>;
	destroy: () => void;
};

// Context for platform state
export type TPlatformContext = {
	platform: EPlatform;
	capabilities: TPlatformCapabilities;
	adapter: TPlatformAdapter | null;
	ready: boolean;
};
