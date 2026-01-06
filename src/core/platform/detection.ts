import { isTMA, parseLaunchParams } from './adapters/tma-bridge';
import { EPlatform } from './types';

declare global {
	interface Window {
		webkit?: {
			messageHandlers?: unknown;
		};
		ReactNativeWebView?: unknown;
	}
}

export function detectPlatform(): EPlatform {
	// Telegram Mini App detection
	// Check both bridge environment and launch params
	if (isTMA() || parseLaunchParams()) {
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
