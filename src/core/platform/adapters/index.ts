import { EPlatform, type TPlatformAdapter } from '../types';

type TAdapterLoader = () => Promise<{ default: TPlatformAdapter }>;

const adapterLoaders: Record<EPlatform, TAdapterLoader> = {
	[EPlatform.PWA]: () => import('./pwa'),
	[EPlatform.TMA]: () => import('./tma'),
	[EPlatform.Webview]: () => import('./webview'),
	[EPlatform.Browser]: () => import('./browser'),
};

export async function loadAdapter(
	platform: EPlatform,
): Promise<TPlatformAdapter> {
	const module = await adapterLoaders[platform]();
	return module.default;
}
