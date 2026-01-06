/// <reference types="vite-svg-loader" />

declare module 'virtual:plugins-loader' {
	import type { TPlugin } from '@/core/plugins';
	export function loadEnabledPlugins(): Promise<TPlugin[]>;
}
