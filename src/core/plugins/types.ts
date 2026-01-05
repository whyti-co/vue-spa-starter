import type { Pinia } from 'pinia';
import type { App } from 'vue';
import type { RouteRecordRaw, Router } from 'vue-router';

// Context passed to plugins during setup/load
export type TPluginContext = {
	app: App;
	router: Router;
	modalRouter: Router;
	pinia: Pinia;
};

// Plugin definition interface
export type TPlugin<TExports = unknown> = {
	name: string;

	// Dependencies on other plugins (must be setup first)
	dependencies?: string[];

	// App routes contributed by this plugin (registered at setup)
	routes?: RouteRecordRaw[];

	// Modal routes contributed by this plugin (registered at setup)
	modalRoutes?: RouteRecordRaw[];

	// Setup phase: runs at startup before app mount (lightweight)
	// Use for: registering global providers, init actions, etc.
	setup?: (ctx: TPluginContext) => void | Promise<void>;

	// Load phase: lazy-loaded on first usePlugin() call
	// Returns the plugin's public API (composables, components, etc.)
	load?: (ctx: TPluginContext) => TExports | Promise<TExports>;
};

// Plugin loader function type (for lazy registration)
export type TPluginLoader<TExports = unknown> = () => Promise<{
	default: TPlugin<TExports>;
}>;

// Plugin configuration (build-time)
export type TPluginEntry = {
	enabled: boolean;
};

export type TPluginsConfig = Record<string, TPluginEntry>;

// Internal plugin state
export type TPluginState = {
	plugin: TPlugin;
	setupDone: boolean;
	exports: unknown | null;
	loading: boolean;
};

// Plugin registry state
export type TPluginRegistry = {
	plugins: Map<string, TPluginState>;
	context: TPluginContext | null;
};
