import type { EPlatform, TPlatformAdapter } from '../types';

type TPlatformDetector = () => boolean;

// Plugin-registered adapters (registered at runtime)
const pluginAdapters = new Map<EPlatform, TPlatformAdapter>();

// Plugin-registered detectors (registered at runtime)
const pluginDetectors = new Map<EPlatform, TPlatformDetector>();

/**
 * Registers a platform detector from a plugin.
 * Called by platform plugins during setup.
 */
export function registerPlatformDetector(
	platform: EPlatform,
	detector: TPlatformDetector,
): void {
	pluginDetectors.set(platform, detector);
}

/**
 * Registers an adapter from a plugin.
 * Called by platform plugins during setup.
 */
export function registerPlatformAdapter(
	platform: EPlatform,
	adapter: TPlatformAdapter,
): void {
	pluginAdapters.set(platform, adapter);
}

/**
 * Returns all registered plugin detectors.
 */
export function getPluginDetectors(): Map<EPlatform, TPlatformDetector> {
	return pluginDetectors;
}

/**
 * Loads the adapter for the given platform.
 * Returns plugin adapter if registered, otherwise browser fallback.
 */
export async function loadAdapter(
	platform: EPlatform,
): Promise<TPlatformAdapter> {
	// Check for plugin-registered adapter
	const pluginAdapter = pluginAdapters.get(platform);
	if (pluginAdapter) {
		return pluginAdapter;
	}

	// Fallback to browser (noop adapter)
	const browserModule = await import('./browser');
	return browserModule.default;
}
