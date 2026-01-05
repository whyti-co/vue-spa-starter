import type { TPlugin } from '@/core/plugins';

declare const __PLUGIN_EXAMPLE_ENABLED__: boolean;

/**
 * Load all enabled plugins.
 *
 * Each plugin is dynamically imported, creating separate chunks.
 * Disabled plugins are tree-shaken via build-time constants.
 */
export async function loadEnabledPlugins(): Promise<TPlugin[]> {
	const plugins: TPlugin[] = [];

	if (__PLUGIN_EXAMPLE_ENABLED__) {
		const { default: plugin } = await import('../../examples/plugin');
		plugins.push(plugin);
	}

	return plugins;
}
