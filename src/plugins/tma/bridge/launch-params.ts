/**
 * Telegram Mini App Launch Parameters
 *
 * Parses launch parameters from URL hash.
 * Should be called early during app initialization as hash may change.
 */

import type { TInitDataUnsafe, TLaunchParams, TThemeParams } from './types';

// Cache parsed params since hash may change during app lifecycle
let cachedParams: TLaunchParams | null = null;

/**
 * Parses theme parameters from JSON string.
 */
function parseThemeParams(value: string | null): TThemeParams {
	if (!value) return {};
	try {
		return JSON.parse(value);
	} catch {
		return {};
	}
}

/**
 * Parses init data from query string format.
 */
function parseInitData(initData: string): TInitDataUnsafe {
	const params = new URLSearchParams(initData);
	const result: Partial<TInitDataUnsafe> = {};

	// Helper to get string value
	const str = (key: string) => params.get(key) ?? undefined;
	const num = (key: string) => {
		const v = params.get(key);
		return v ? Number.parseInt(v, 10) : undefined;
	};

	// Simple string/number fields
	result.query_id = str('query_id');
	result.chat_type = str('chat_type') as TInitDataUnsafe['chat_type'];
	result.chat_instance = str('chat_instance');
	result.start_param = str('start_param');
	result.auth_date = num('auth_date') ?? 0;
	result.hash = str('hash') ?? '';
	result.can_send_after = num('can_send_after');

	// JSON fields
	const userStr = params.get('user');
	if (userStr) {
		try {
			result.user = JSON.parse(userStr);
		} catch {
			// Invalid JSON, skip
		}
	}

	const receiverStr = params.get('receiver');
	if (receiverStr) {
		try {
			result.receiver = JSON.parse(receiverStr);
		} catch {
			// Invalid JSON, skip
		}
	}

	const chatStr = params.get('chat');
	if (chatStr) {
		try {
			result.chat = JSON.parse(chatStr);
		} catch {
			// Invalid JSON, skip
		}
	}

	return result as TInitDataUnsafe;
}

/**
 * Parses launch parameters from URL hash.
 * Returns null if not running in TMA environment.
 */
export function parseLaunchParams(): TLaunchParams | null {
	// Return cached if available
	if (cachedParams) return cachedParams;

	if (typeof window === 'undefined') return null;

	// Get hash without the # character
	const hash = window.location.hash.slice(1);
	if (!hash) return null;

	const params = new URLSearchParams(hash);

	// Check if this looks like TMA params
	const version = params.get('tgWebAppVersion');
	if (!version) return null;

	const initData = params.get('tgWebAppData') || '';

	cachedParams = {
		version,
		platform: params.get('tgWebAppPlatform') || 'unknown',
		initData,
		initDataUnsafe: parseInitData(initData),
		themeParams: parseThemeParams(params.get('tgWebAppThemeParams')),
		startParam: params.get('tgWebAppStartParam') || undefined,
	};

	return cachedParams;
}

/**
 * Gets cached launch params without re-parsing.
 */
export function getLaunchParams(): TLaunchParams | null {
	return cachedParams;
}

/**
 * Clears the cached launch params.
 * Useful for testing or when hash is manually updated.
 */
export function clearLaunchParamsCache(): void {
	cachedParams = null;
}

/**
 * Gets the current user from launch params.
 */
export function getUser(): TInitDataUnsafe['user'] | undefined {
	return cachedParams?.initDataUnsafe.user;
}

/**
 * Gets the start parameter from launch params.
 */
export function getStartParam(): string | undefined {
	return cachedParams?.startParam || cachedParams?.initDataUnsafe.start_param;
}

/**
 * Gets the theme parameters from launch params.
 */
export function getThemeParams(): TThemeParams {
	return cachedParams?.themeParams || {};
}

/**
 * Gets the platform identifier.
 */
export function getPlatform(): string {
	return cachedParams?.platform || 'unknown';
}

/**
 * Gets the TMA version.
 */
export function getVersion(): string {
	return cachedParams?.version || '0.0';
}

/**
 * Compares version strings.
 * Returns true if current version >= required version.
 */
export function isVersionAtLeast(requiredVersion: string): boolean {
	const current = getVersion();
	const currentParts = current.split('.').map(Number);
	const requiredParts = requiredVersion.split('.').map(Number);

	for (
		let i = 0;
		i < Math.max(currentParts.length, requiredParts.length);
		i++
	) {
		const currentPart = currentParts[i] || 0;
		const requiredPart = requiredParts[i] || 0;

		if (currentPart > requiredPart) return true;
		if (currentPart < requiredPart) return false;
	}

	return true; // Equal versions
}
