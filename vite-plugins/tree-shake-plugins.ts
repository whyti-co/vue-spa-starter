import type { Plugin } from 'vite';
import { plugins } from '../plugins.config';
import type { TPluginEntry } from '../src/core/plugins/types';

/**
 * Vite plugin that creates compile-time constants for plugin enabled/disabled state.
 * This allows dead code elimination (tree-shaking) for disabled plugins.
 *
 * For each plugin in plugins.config.ts, creates a constant:
 * __PLUGIN_NAME_ENABLED__ = true/false
 *
 * Usage in code:
 * if (__PLUGIN_WEB3_ENABLED__) {
 *   // This code is removed at build time if web3 is disabled
 * }
 */
export function treeShakePlugins(): Plugin {
	const defines: Record<string, string> = {};

	for (const [name, entry] of Object.entries(plugins) as [
		string,
		TPluginEntry,
	][]) {
		const key = `__PLUGIN_${name.toUpperCase()}_ENABLED__`;
		defines[key] = JSON.stringify(entry.enabled);
	}

	return {
		name: 'tree-shake-plugins',
		config() {
			return {
				define: defines,
			};
		},
	};
}
