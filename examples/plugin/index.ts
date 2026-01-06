/**
 * Examples Plugin
 *
 * Provides /examples pages showcasing various app features.
 * Enable in plugins.config.ts to access example pages during development.
 */
import type { TPlugin } from '@/core/plugins';
import type { TExampleExports } from './exports';

const plugin: TPlugin<TExampleExports> = {
	name: 'examples',

	routes: [
		{
			path: '/examples',
			name: 'examples',
			component: () => import('./pages/index'),
		},
		{
			path: '/examples/modals',
			name: 'examples-modals',
			component: () => import('./pages/modals'),
		},
		{
			path: '/examples/stores',
			name: 'examples-stores',
			component: () => import('./pages/stores'),
		},
		{
			path: '/examples/i18n',
			name: 'examples-i18n',
			component: () => import('./pages/i18n'),
		},
		{
			path: '/examples/theme',
			name: 'examples-theme',
			component: () => import('./pages/theme'),
		},
		{
			path: '/examples/layout',
			name: 'examples-layout',
			component: () => import('./pages/layout'),
		},
		{
			path: '/examples/async',
			name: 'examples-async',
			component: () => import('./pages/async'),
		},
		{
			path: '/examples/platform',
			name: 'examples-platform',
			component: () => import('./pages/platform'),
		},
		{
			path: '/examples/platform/tma',
			name: 'examples-platform-tma',
			component: () => import('./pages/tma'),
		},
		{
			path: '/examples/plugins',
			name: 'examples-plugins',
			component: () => import('./pages/plugins'),
		},
	],

	modalRoutes: [
		{
			path: '/examples/demo-modal',
			component: () => import('./modals/index'),
		},
	],

	setup: async (_ctx) => {
		console.log('[examples] Plugin loaded');
	},

	load: () => import('./exports').then((m) => m.default),
};

export default plugin;
