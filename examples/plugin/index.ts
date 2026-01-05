/**
 * Example Plugin - index.ts
 *
 * This file is loaded at startup during the setup phase.
 * Keep it lightweight - only define routes and setup logic here.
 * Heavy code goes in exports.ts (lazy-loaded).
 *
 * Bundle structure:
 * - index.ts → loaded at startup (tiny)
 * - exports.ts → lazy chunk (loaded on first usePlugin call)
 * - pages/* → lazy chunks (loaded on route navigation)
 * - modals/* → lazy chunks (loaded on modal open)
 */
import type { TPlugin } from '@/core/plugins';
import type { TExampleExports } from './exports';

const plugin: TPlugin<TExampleExports> = {
	name: 'example',

	// App routes (components lazy-loaded on navigation)
	routes: [
		{
			path: '/example',
			name: 'example',
			component: () => import('./pages/index'),
		},
	],

	// Modal routes (components lazy-loaded on modal open)
	modalRoutes: [
		{
			path: '/example-modal',
			component: () => import('./modals/index'),
		},
	],

	// Setup runs at startup before app mount
	setup: async (_ctx) => {
		console.log('[example] Plugin setup complete');
	},

	// Heavy exports lazy-loaded on first usePlugin('example') call
	load: () => import('./exports').then((m) => m.default),
};

export default plugin;
