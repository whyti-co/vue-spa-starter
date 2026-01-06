import type { Plugin } from 'vite';
import { plugins } from '../plugins.config';
import type { TPluginEntry } from '../src/core/plugins/types';

const VIRTUAL_MODULE_ID = 'virtual:plugins-loader';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

/**
 * Generates the plugin loader code based on plugins.config.ts.
 * Plugins load in the order they appear in the config.
 */
function generateLoaderCode(): string {
	const enabledPlugins = Object.entries(plugins)
		.filter(([, entry]) => (entry as TPluginEntry).enabled)
		.map(([name]) => name);

	const imports = enabledPlugins
		.map((name) => {
			// Examples plugin is in a different location
			if (name === 'examples') {
				return `    await import('/examples/plugin')`;
			}
			return `    await import('/src/plugins/${name}')`;
		})
		.join(',\n');

	return `
export async function loadEnabledPlugins() {
  const modules = [
${imports}
  ];
  return modules.map(m => m.default);
}
`;
}

/**
 * Vite plugin that:
 * 1. Creates compile-time constants for plugin enabled/disabled state
 * 2. Generates a virtual module with the plugin loader
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

		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_VIRTUAL_MODULE_ID;
			}
		},

		load(id) {
			if (id === RESOLVED_VIRTUAL_MODULE_ID) {
				return generateLoaderCode();
			}
		},
	};
}
