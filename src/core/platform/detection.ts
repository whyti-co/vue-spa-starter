import { EPlatform } from './types';

declare global {
	interface Window {
		Telegram?: {
			WebApp?: {
				initData: string;
				initDataUnsafe: unknown;
				ready: () => void;
			};
		};
		webkit?: {
			messageHandlers?: unknown;
		};
		ReactNativeWebView?: unknown;
	}
}

export function detectPlatform(): EPlatform {
	// Telegram Mini App detection
	if (window.Telegram?.WebApp?.initData) {
		return EPlatform.TMA;
	}

	// iOS WebView detection (WKWebView)
	if (window.webkit?.messageHandlers) {
		return EPlatform.Webview;
	}

	// Android WebView / React Native WebView detection
	if (window.ReactNativeWebView) {
		return EPlatform.Webview;
	}

	// PWA detection (installed or in standalone mode)
	if (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as { standalone?: boolean }).standalone === true
	) {
		return EPlatform.PWA;
	}

	// Default to browser
	return EPlatform.Browser;
}
