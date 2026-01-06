import { readonly, ref, shallowRef } from 'vue';
import { getDaisyUIColors } from '@/utils';
import { loadAdapter } from './adapters';
import { detectPlatform } from './detection';
import {
	EPlatform,
	type TBiometry,
	type THaptics,
	type TThemeColors,
	type TPlatformAdapter,
	type TPlatformCapabilities,
} from './types';

export type {
	TBiometry,
	THaptics,
	TPlatformAdapter,
	TPlatformCapabilities,
} from './types';
export { EPlatform } from './types';

// Module-level state (singleton)
const platform = ref<EPlatform>(EPlatform.Browser);
const capabilities = ref<TPlatformCapabilities>({
	haptics: false,
	biometry: false,
	themeSync: false,
	cloudStorage: false,
	share: false,
	notifications: false,
});
const adapter = shallowRef<TPlatformAdapter | null>(null);
const ready = ref(false);

// Noop fallbacks
const noopHaptics: THaptics = {
	available: false,
	impact: () => {},
	notification: () => {},
	selectionChanged: () => {},
};

const noopBiometry: TBiometry = {
	available: false,
	type: null,
	accessGranted: false,
	requestAccess: async () => false,
	authenticate: async () => false,
	openSettings: () => {},
};

/**
 * Initialize platform detection and load adapter.
 * Called once during app startup.
 */
export async function initPlatform(): Promise<void> {
	platform.value = detectPlatform();

	try {
		const loadedAdapter = await loadAdapter(platform.value);
		await loadedAdapter.init();

		adapter.value = loadedAdapter;
		capabilities.value = loadedAdapter.capabilities;
		ready.value = true;

		// Sync platform theme after adapter is ready
		requestAnimationFrame(() => {
			useThemeSync().updatePlatformTheme();
		});
	} catch (error) {
		console.error('Failed to initialize platform adapter:', error);
		ready.value = true; // Still mark as ready, just with fallbacks
	}
}

/**
 * Main platform composable.
 */
export function usePlatform() {
	return {
		platform: readonly(platform),
		capabilities: readonly(capabilities),
		ready: readonly(ready),

		// Convenience checks
		isPWA: () => platform.value === EPlatform.PWA,
		isTMA: () => platform.value === EPlatform.TMA,
		isBrowser: () => platform.value === EPlatform.Browser,
	};
}

/**
 * Haptics composable with graceful fallback.
 */
export function useHaptics(): THaptics {
	return adapter.value?.haptics ?? noopHaptics;
}

/**
 * Biometry composable with graceful fallback.
 */
export function useBiometry(): TBiometry {
	return adapter.value?.biometry ?? noopBiometry;
}

/**
 * Theme sync composable for platform theme integration.
 */
export function useThemeSync() {
	if (!adapter.value?.themeSync.available) {
		return {
			available: false,
			subscribe: () => () => {},
			updatePlatformTheme: (_colors?: TThemeColors) => {},
			getOriginalColors: () => undefined as TThemeColors | undefined,
		};
	}

	return {
		available: true,
		subscribe: adapter.value.themeSync.subscribe,
		updatePlatformTheme: (colors?: TThemeColors) => {
			const themeColors = colors ?? getDaisyUIColors();
			adapter.value?.themeSync.updateTheme(themeColors);
		},
		getOriginalColors: adapter.value.themeSync.getOriginalColors,
	};
}
