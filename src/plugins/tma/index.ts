/**
 * TMA Plugin
 *
 * Telegram Mini App integration plugin. Provides full TMA bridge,
 * reactive state, and platform-specific features.
 *
 * Enable in plugins.config.ts to use TMA features.
 * When disabled, the app falls back to browser adapter in TMA environment.
 */
import {
	registerPlatformAdapter,
	registerPlatformDetector,
} from '@/core/platform/adapters';
import { EPlatform } from '@/core/platform/types';
import type { TPlugin } from '@/core/plugins';
import adapter from './adapter';
import { isTMA } from './bridge';
import type { TTmaExports } from './exports';

const plugin: TPlugin<TTmaExports> = {
	name: 'tma',

	setup: async (_ctx) => {
		// Register TMA detector and adapter
		registerPlatformDetector(EPlatform.TMA, isTMA);
		registerPlatformAdapter(EPlatform.TMA, adapter);
	},

	load: () => import('./exports').then((m) => m.default),
};

export default plugin;
