/**
 * PWA Plugin
 *
 * Progressive Web App platform plugin. Provides haptics via Vibration API,
 * notifications, and Web Share API support.
 *
 * Enable in plugins.config.ts to use PWA features.
 */
import {
	registerPlatformAdapter,
	registerPlatformDetector,
} from '@/core/platform/adapters';
import { EPlatform } from '@/core/platform/types';
import type { TPlugin } from '@/core/plugins';
import adapter from './adapter';
import type { TPwaExports } from './exports';

/**
 * Detect if running as installed PWA (standalone mode)
 */
function isPWA(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as { standalone?: boolean }).standalone === true
	);
}

const plugin: TPlugin<TPwaExports> = {
	name: 'pwa',

	setup: async (_ctx) => {
		// Register PWA detector and adapter
		registerPlatformDetector(EPlatform.PWA, isPWA);
		registerPlatformAdapter(EPlatform.PWA, adapter);
	},

	load: () => import('./exports').then((m) => m.default),
};

export default plugin;
