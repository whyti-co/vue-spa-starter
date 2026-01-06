import { shallowReactive } from 'vue';
import { LAYOUT_ROUTE_NAME } from '@/core/router';
import type { TPlugin, TPluginRegistry, TPluginState } from './types';

export const registry: TPluginRegistry = shallowReactive({
	plugins: new Map(),
	context: null,
});

/**
 * Register a plugin (does not run setup yet)
 */
export function registerPlugin(plugin: TPlugin): void {
	if (!plugin?.name) {
		console.error('[plugins] Invalid plugin (missing name):', plugin);
		return;
	}
	if (registry.plugins.has(plugin.name)) {
		console.warn(`Plugin "${plugin.name}" is already registered`);
		return;
	}

	const state: TPluginState = {
		plugin,
		setupDone: false,
		exports: null,
		loading: false,
	};

	registry.plugins.set(plugin.name, state);
}

/**
 * Run setup phase for a plugin (routes, init actions)
 */
export async function setupPlugin(name: string): Promise<void> {
	const state = registry.plugins.get(name);
	if (!state) {
		throw new Error(`Plugin "${name}" not found`);
	}

	if (state.setupDone) {
		return;
	}

	const ctx = registry.context;
	if (!ctx) {
		throw new Error('Plugin context not initialized');
	}

	// Setup dependencies first
	if (state.plugin.dependencies) {
		for (const dep of state.plugin.dependencies) {
			await setupPlugin(dep);
		}
	}

	// Register app routes (as children of the main layout route)
	if (state.plugin.routes) {
		for (const route of state.plugin.routes) {
			ctx.router.addRoute(LAYOUT_ROUTE_NAME, route);
		}
	}

	// Register modal routes
	if (state.plugin.modalRoutes) {
		for (const route of state.plugin.modalRoutes) {
			ctx.modalRouter.addRoute(route);
		}
	}

	// Run setup hook
	if (state.plugin.setup) {
		await state.plugin.setup(ctx);
	}

	state.setupDone = true;
}

/**
 * Load plugin exports (lazy, on first usePlugin call)
 */
export async function loadPluginExports<T>(name: string): Promise<T | null> {
	const state = registry.plugins.get(name);
	if (!state) {
		return null;
	}

	// Already loaded
	if (state.exports !== null) {
		return state.exports as T;
	}

	// Currently loading (wait for it)
	if (state.loading) {
		return new Promise((resolve) => {
			const check = () => {
				if (!state.loading) {
					resolve(state.exports as T);
				} else {
					setTimeout(check, 10);
				}
			};
			check();
		});
	}

	// Load exports
	if (!state.plugin.load) {
		return null;
	}

	const ctx = registry.context;
	if (!ctx) {
		throw new Error('Plugin context not initialized');
	}

	state.loading = true;
	try {
		state.exports = await state.plugin.load(ctx);
		return state.exports as T;
	} catch (error) {
		console.error(`Failed to load plugin "${name}":`, error);
		return null;
	} finally {
		state.loading = false;
	}
}

/**
 * Check if plugin is registered
 */
export function isPluginRegistered(name: string): boolean {
	return registry.plugins.has(name);
}

/**
 * Check if plugin setup is done
 */
export function isPluginReady(name: string): boolean {
	const state = registry.plugins.get(name);
	return state?.setupDone ?? false;
}
