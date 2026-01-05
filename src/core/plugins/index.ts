import type { Pinia } from 'pinia';
import type { App } from 'vue';
import { type Ref, readonly, ref, type ShallowRef, shallowRef } from 'vue';
import type { Router } from 'vue-router';
import {
	isPluginReady,
	isPluginRegistered,
	loadPluginExports,
	registerPlugin,
	registry,
	setupPlugin,
} from './registry';
import type { TPlugin } from './types';

export type { TPlugin, TPluginContext, TPluginsConfig } from './types';

/**
 * Initialize the plugin system.
 * Call this in main.ts before app.mount()
 */
export async function initPlugins(
	plugins: TPlugin[],
	options: { app: App; router: Router; modalRouter: Router; pinia: Pinia },
): Promise<void> {
	const { app, router, modalRouter, pinia } = options;

	// Set context for all plugins
	registry.context = { app, router, modalRouter, pinia };

	// Register all plugins
	for (const plugin of plugins) {
		registerPlugin(plugin);
	}

	// Run setup phase for all plugins
	for (const plugin of plugins) {
		await setupPlugin(plugin.name);
	}
}

export type TUsePluginResult<T> = {
	ready: Readonly<Ref<boolean>>;
	data: Readonly<ShallowRef<T | null>>;
};

// Cache for plugin refs to ensure same instance is returned
const pluginRefs = new Map<string, TUsePluginResult<unknown>>();

/**
 * Get plugin exports (lazy-loaded on first call).
 * Returns reactive refs that update when plugin is loaded.
 *
 * @example
 * const { ready, data: example } = usePlugin<TWeb3Exports>('web3')
 *
 * // In render function:
 * if (!ready.value || !example.value) return <Loading />
 * const wallet = example.value.useWallet()
 */
export function usePlugin<T>(name: string): TUsePluginResult<T> {
	// Return cached refs if already requested
	if (pluginRefs.has(name)) {
		return pluginRefs.get(name) as TUsePluginResult<T>;
	}

	const ready = ref(false);
	const data = shallowRef<T | null>(null);

	const result: TUsePluginResult<T> = {
		ready: readonly(ready),
		data: readonly(data) as Readonly<ShallowRef<T | null>>,
	};

	pluginRefs.set(name, result as TUsePluginResult<unknown>);

	// Start loading if plugin is registered
	if (isPluginRegistered(name)) {
		loadPluginExports<T>(name).then((exports) => {
			data.value = exports;
			ready.value = true;
		});
	}

	return result;
}

/**
 * Check if a plugin is registered and setup is complete.
 */
export { isPluginReady };
