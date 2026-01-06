/**
 * Telegram Mini App Bridge
 *
 * Minimal TMA communication library using Vue reactivity.
 * Replaces heavy dependencies like @telegram-apps/bridge.
 *
 * @example
 * ```ts
 * import { initTMA, postEvent, subscribe, state } from './tma-bridge'
 *
 * // Initialize on app start
 * initTMA()
 *
 * // Send events to Telegram
 * postEvent('web_app_ready')
 * postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'medium' })
 *
 * // Subscribe to events
 * subscribe('theme_changed', (data) => {
 *   console.log('Theme:', data.theme_params)
 * })
 *
 * // Access reactive state
 * watch(state.themeParams, (params) => {
 *   // React to theme changes
 * })
 * ```
 */

import { readonly, ref, shallowRef } from 'vue';
import { syncSafeAreaToCSSVariables } from '@/utils';
import {
	getEnvironment,
	initBridge,
	isTMA,
	postEvent,
	subscribe,
	subscribeOnce,
	waitForEvent,
} from './bridge';
import {
	getLaunchParams,
	getPlatform,
	getStartParam,
	getThemeParams,
	getUser,
	getVersion,
	isVersionAtLeast,
	parseLaunchParams,
} from './launch-params';
import type { TEventMap, TThemeParams } from './types';

// ============================================================================
// Theme CSS Variables
// ============================================================================

/**
 * Maps TMA theme params to CSS custom properties.
 * Call this to sync Telegram theme colors to CSS variables.
 */
export function syncThemeToCSSVariables(params: TThemeParams): void {
	const root = document.documentElement;

	// Map all theme params to CSS variables with --tg- prefix
	const mapping: [keyof TThemeParams, string][] = [
		['bg_color', '--tg-bg-color'],
		['text_color', '--tg-text-color'],
		['hint_color', '--tg-hint-color'],
		['link_color', '--tg-link-color'],
		['button_color', '--tg-button-color'],
		['button_text_color', '--tg-button-text-color'],
		['secondary_bg_color', '--tg-secondary-bg-color'],
		['header_bg_color', '--tg-header-bg-color'],
		['bottom_bar_bg_color', '--tg-bottom-bar-bg-color'],
		['accent_text_color', '--tg-accent-text-color'],
		['section_bg_color', '--tg-section-bg-color'],
		['section_header_text_color', '--tg-section-header-text-color'],
		['section_separator_color', '--tg-section-separator-color'],
		['subtitle_text_color', '--tg-subtitle-text-color'],
		['destructive_text_color', '--tg-destructive-text-color'],
	];

	for (const [key, cssVar] of mapping) {
		const value = params[key];
		if (value) {
			root.style.setProperty(cssVar, value);
		}
	}
}

// Re-export types
export type {
	TEventMap,
	TInitDataUnsafe,
	TLaunchParams,
	TPostEventMap,
	TThemeParams,
} from './types';

// Re-export bridge functions
export {
	getEnvironment,
	isTMA,
	postEvent,
	subscribe,
	subscribeOnce,
	waitForEvent,
};

// Re-export launch params functions
export {
	getLaunchParams,
	getPlatform,
	getStartParam,
	getThemeParams,
	getUser,
	getVersion,
	isVersionAtLeast,
	parseLaunchParams,
};

// ============================================================================
// Vue Reactive State
// ============================================================================

const _isReady = ref(false);
const _isExpanded = ref(false);
const _isFullscreen = ref(false);
const _isVisible = ref(true);
const _viewportHeight = ref(0);
const _viewportWidth = ref(0);
const _viewportStable = ref(false);
const _themeParams = shallowRef<TThemeParams>({});
const _originalThemeParams = shallowRef<TThemeParams>({});
const _safeArea = ref({ top: 0, bottom: 0, left: 0, right: 0 });
const _contentSafeArea = ref({ top: 0, bottom: 0, left: 0, right: 0 });
const _biometryInfo = shallowRef<TEventMap['biometry_info_received'] | null>(
	null,
);

/**
 * Vue-reactive TMA state.
 * All properties are readonly refs that update automatically.
 */
export const state = {
	/** Whether the bridge is initialized and ready */
	isReady: readonly(_isReady),
	/** Whether the app is expanded to full height */
	isExpanded: readonly(_isExpanded),
	/** Whether the app is in fullscreen mode */
	isFullscreen: readonly(_isFullscreen),
	/** Whether the app is currently visible */
	isVisible: readonly(_isVisible),
	/** Current viewport height in pixels */
	viewportHeight: readonly(_viewportHeight),
	/** Current viewport width in pixels (may be 0 if not provided) */
	viewportWidth: readonly(_viewportWidth),
	/** Whether the viewport size is stable (not animating) */
	viewportStable: readonly(_viewportStable),
	/** Current theme parameters from Telegram */
	themeParams: readonly(_themeParams),
	/** Original theme parameters from Telegram (at initialization) */
	originalThemeParams: readonly(_originalThemeParams),
	/** Safe area insets (notch, home indicator, etc.) */
	safeArea: readonly(_safeArea),
	/** Content safe area insets */
	contentSafeArea: readonly(_contentSafeArea),
	/** Biometry information (available after requesting) */
	biometryInfo: readonly(_biometryInfo),
};

// ============================================================================
// Initialization
// ============================================================================

let isInitialized = false;

/**
 * Initializes the TMA bridge.
 * Should be called once at app startup.
 *
 * @returns true if running in TMA environment, false otherwise
 */
export function initTMA(): boolean {
	if (isInitialized) return _isReady.value;
	isInitialized = true;

	// Parse launch params first (they may disappear from hash)
	const launchParams = parseLaunchParams();

	// If no launch params, we're not in TMA
	if (!launchParams && !isTMA()) {
		return false;
	}

	// Initialize the event bridge
	initBridge();

	// Set initial state from launch params
	if (launchParams) {
		_themeParams.value = launchParams.themeParams;
		_originalThemeParams.value = { ...launchParams.themeParams };
		// Sync theme to CSS variables immediately
		syncThemeToCSSVariables(launchParams.themeParams);
	}

	// Subscribe to viewport changes
	subscribe('viewport_changed', (data) => {
		_viewportHeight.value = data.height;
		if (data.width) _viewportWidth.value = data.width;
		_isExpanded.value = data.is_expanded;
		_viewportStable.value = data.is_state_stable;
		if (data.is_fullscreen !== undefined) {
			_isFullscreen.value = data.is_fullscreen;
		}
	});

	// Subscribe to fullscreen changes
	subscribe('fullscreen_changed', (data) => {
		_isFullscreen.value = data.is_fullscreen;
	});

	// Subscribe to theme changes
	subscribe('theme_changed', (data) => {
		_themeParams.value = data.theme_params;
		// Sync theme to CSS variables on change
		syncThemeToCSSVariables(data.theme_params);
	});

	// Subscribe to visibility changes
	subscribe('visibility_changed', (data) => {
		_isVisible.value = data.is_visible;
	});

	// Subscribe to safe area changes
	subscribe('safe_area_changed', (data) => {
		_safeArea.value = data;
		syncSafeAreaToCSSVariables(_safeArea.value, _contentSafeArea.value);
	});

	subscribe('content_safe_area_changed', (data) => {
		_contentSafeArea.value = data;
		syncSafeAreaToCSSVariables(_safeArea.value, _contentSafeArea.value);
	});

	// Subscribe to biometry info
	subscribe('biometry_info_received', (data) => {
		_biometryInfo.value = data;
	});

	// Signal ready to Telegram
	postEvent('web_app_ready');

	// Request initial data
	postEvent('web_app_request_viewport');
	postEvent('web_app_request_theme');
	postEvent('web_app_request_safe_area');
	postEvent('web_app_request_content_safe_area');

	_isReady.value = true;
	return true;
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * Expands the Mini App to full height.
 */
export function expand(): void {
	postEvent('web_app_expand');
}

/**
 * Closes the Mini App.
 */
export function close(): void {
	postEvent('web_app_close');
}

/**
 * Requests fullscreen mode.
 */
export function requestFullscreen(): void {
	postEvent('web_app_request_fullscreen');
}

/**
 * Exits fullscreen mode.
 */
export function exitFullscreen(): void {
	postEvent('web_app_exit_fullscreen');
}

/**
 * Toggles fullscreen mode.
 */
export function toggleFullscreen(): void {
	if (_isFullscreen.value) {
		exitFullscreen();
	} else {
		requestFullscreen();
	}
}

// ============================================================================
// Behavior Control
// ============================================================================

/**
 * Sets whether closing confirmation is needed.
 */
export function setClosingConfirmation(needConfirmation: boolean): void {
	postEvent('web_app_setup_closing_behavior', {
		need_confirmation: needConfirmation,
	});
}

/**
 * Sets whether vertical swipes are allowed.
 * When disabled, the user cannot swipe down to minimize the app.
 */
export function setSwipeEnabled(enabled: boolean): void {
	postEvent('web_app_setup_swipe_behavior', {
		allow_vertical_swipe: enabled,
	});
}

/**
 * Sets the back button visibility.
 */
export function setBackButtonVisible(visible: boolean): void {
	postEvent('web_app_setup_back_button', { is_visible: visible });
}

/**
 * Triggers haptic feedback.
 */
export function hapticFeedback(
	type: 'impact',
	style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
): void;
export function hapticFeedback(
	type: 'notification',
	notificationType: 'error' | 'success' | 'warning',
): void;
export function hapticFeedback(type: 'selection_change'): void;
export function hapticFeedback(
	type: 'impact' | 'notification' | 'selection_change',
	param?: string,
): void {
	if (type === 'impact') {
		postEvent('web_app_trigger_haptic_feedback', {
			type: 'impact',
			impact_style: param as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
		});
	} else if (type === 'notification') {
		postEvent('web_app_trigger_haptic_feedback', {
			type: 'notification',
			notification_type: param as 'error' | 'success' | 'warning',
		});
	} else {
		postEvent('web_app_trigger_haptic_feedback', { type: 'selection_change' });
	}
}

/**
 * Opens a link in the browser.
 */
export function openLink(url: string, tryInstantView = false): void {
	postEvent('web_app_open_link', { url, try_instant_view: tryInstantView });
}

/**
 * Opens a Telegram link (t.me).
 */
export function openTelegramLink(path: string): void {
	postEvent('web_app_open_tg_link', { path_full: path });
}

/**
 * Shows a popup dialog.
 */
export async function showPopup(options: {
	title?: string;
	message: string;
	buttons?: Array<{
		id?: string;
		type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
		text?: string;
	}>;
}): Promise<string | undefined> {
	const buttons = options.buttons || [{ type: 'ok' as const }];
	postEvent('web_app_open_popup', {
		title: options.title,
		message: options.message,
		buttons: buttons.map((b) => ({
			id: b.id,
			type: b.type || 'default',
			text: b.text,
		})),
	});

	const result = await waitForEvent('popup_closed');
	return result.button_id;
}

/**
 * Requests biometry info.
 */
export async function requestBiometryInfo(): Promise<
	TEventMap['biometry_info_received']
> {
	postEvent('web_app_biometry_get_info');
	return waitForEvent('biometry_info_received');
}

/**
 * Requests access to biometry.
 * Must be called before authenticate if access_granted is false.
 */
export async function requestBiometryAccess(reason?: string): Promise<boolean> {
	postEvent('web_app_biometry_request_access', { reason });
	const result = await waitForEvent('biometry_info_received');
	return result.access_granted ?? false;
}

/**
 * Opens biometry settings.
 */
export function openBiometrySettings(): void {
	postEvent('web_app_biometry_open_settings');
}

/**
 * Updates the biometry token stored on device.
 */
export async function updateBiometryToken(
	token: string,
): Promise<'updated' | 'removed' | 'failed'> {
	postEvent('web_app_biometry_update_token', { token });
	const result = await waitForEvent('biometry_token_updated');
	return result.status;
}

/**
 * Requests biometry authentication.
 */
export async function authenticateWithBiometry(
	reason?: string,
): Promise<{ success: boolean; token?: string }> {
	postEvent('web_app_biometry_request_auth', { reason });
	const result = await waitForEvent('biometry_auth_requested');
	return {
		success: result.status === 'authorized',
		token: result.token,
	};
}

/**
 * Sets header color.
 */
export function setHeaderColor(color: string): void {
	if (color === 'bg_color' || color === 'secondary_bg_color') {
		postEvent('web_app_set_header_color', { color_key: color });
	} else {
		postEvent('web_app_set_header_color', { color });
	}
}

/**
 * Sets background color.
 */
export function setBackgroundColor(color: string): void {
	postEvent('web_app_set_background_color', { color });
}

/**
 * Sets bottom bar color.
 */
export function setBottomBarColor(color: string): void {
	postEvent('web_app_set_bottom_bar_color', { color });
}

// ============================================================================
// Main Button
// ============================================================================

export type TMainButtonParams = {
	text?: string;
	color?: string;
	textColor?: string;
	isVisible?: boolean;
	isActive?: boolean;
	isProgressVisible?: boolean;
};

/**
 * Configures the main button.
 */
export function setupMainButton(params: TMainButtonParams): void {
	postEvent('web_app_setup_main_button', {
		text: params.text,
		color: params.color,
		text_color: params.textColor,
		is_visible: params.isVisible,
		is_active: params.isActive,
		is_progress_visible: params.isProgressVisible,
	});
}

/**
 * Shows the main button.
 */
export function showMainButton(text: string, color?: string): void {
	setupMainButton({ text, color, isVisible: true, isActive: true });
}

/**
 * Hides the main button.
 */
export function hideMainButton(): void {
	setupMainButton({ isVisible: false });
}

/**
 * Subscribes to main button clicks.
 */
export function onMainButtonClick(callback: () => void): () => void {
	return subscribe('main_button_pressed', callback);
}

// ============================================================================
// Secondary Button
// ============================================================================

export type TSecondaryButtonParams = TMainButtonParams & {
	position?: 'left' | 'right' | 'top' | 'bottom';
};

/**
 * Configures the secondary button.
 */
export function setupSecondaryButton(params: TSecondaryButtonParams): void {
	postEvent('web_app_setup_secondary_button', {
		text: params.text,
		color: params.color,
		text_color: params.textColor,
		is_visible: params.isVisible,
		is_active: params.isActive,
		is_progress_visible: params.isProgressVisible,
		position: params.position,
	});
}

/**
 * Subscribes to secondary button clicks.
 */
export function onSecondaryButtonClick(callback: () => void): () => void {
	return subscribe('secondary_button_pressed', callback);
}

// ============================================================================
// Settings Button
// ============================================================================

/**
 * Shows or hides the settings button.
 */
export function setSettingsButtonVisible(visible: boolean): void {
	postEvent('web_app_setup_settings_button', { is_visible: visible });
}

/**
 * Subscribes to settings button clicks.
 */
export function onSettingsButtonClick(callback: () => void): () => void {
	return subscribe('settings_button_pressed', callback);
}

/**
 * Subscribes to back button clicks.
 */
export function onBackButtonClick(callback: () => void): () => void {
	return subscribe('back_button_pressed', callback);
}

// ============================================================================
// QR Scanner
// ============================================================================

/**
 * Opens QR scanner and returns scanned data.
 */
export async function scanQR(text?: string): Promise<string | undefined> {
	postEvent('web_app_open_scan_qr_popup', { text });
	const result = await waitForEvent('qr_text_received');
	return result.data;
}

/**
 * Closes the QR scanner popup.
 */
export function closeQRScanner(): void {
	postEvent('web_app_close_scan_qr_popup');
}

// ============================================================================
// Clipboard
// ============================================================================

let clipboardReqId = 0;

/**
 * Reads text from clipboard.
 * Returns undefined if access denied or no text available.
 */
export async function readClipboard(): Promise<string | undefined> {
	const reqId = `clipboard_${++clipboardReqId}`;
	postEvent('web_app_read_text_from_clipboard', { req_id: reqId });

	return new Promise((resolve) => {
		const unsubscribe = subscribe('clipboard_text_received', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				resolve(data.data);
			}
		});
	});
}

// ============================================================================
// Invoice
// ============================================================================

export type TInvoiceStatus = 'paid' | 'cancelled' | 'failed' | 'pending';

/**
 * Opens an invoice for payment.
 * Returns the payment status when closed.
 */
export async function openInvoice(slug: string): Promise<TInvoiceStatus> {
	postEvent('web_app_open_invoice', { slug });

	return new Promise((resolve) => {
		const unsubscribe = subscribe('invoice_closed', (data) => {
			if (data.slug === slug) {
				unsubscribe();
				resolve(data.status);
			}
		});
	});
}

// ============================================================================
// Permissions
// ============================================================================

/**
 * Requests write access permission.
 */
export async function requestWriteAccess(): Promise<boolean> {
	postEvent('web_app_request_write_access');
	const result = await waitForEvent('write_access_requested');
	return result.status === 'allowed';
}

/**
 * Requests phone number access.
 */
export async function requestPhone(): Promise<boolean> {
	postEvent('web_app_request_phone');
	const result = await waitForEvent('phone_requested');
	return result.status === 'sent';
}

// ============================================================================
// Data
// ============================================================================

/**
 * Sends data to the bot.
 * This closes the Mini App and sends the data to the bot's message handler.
 */
export function sendData(data: string): void {
	postEvent('web_app_data_send', { data });
}

/**
 * Switches to inline query mode.
 */
export function switchInlineQuery(query: string, chatTypes?: string[]): void {
	postEvent('web_app_switch_inline_query', { query, chat_types: chatTypes });
}

// ============================================================================
// Device Sensors
// ============================================================================

export type TAccelerometerData = { x: number; y: number; z: number };
export type TGyroscopeData = { x: number; y: number; z: number };
export type TDeviceOrientationData = {
	alpha: number;
	beta: number;
	gamma: number;
	absolute: boolean;
};

/**
 * Starts accelerometer tracking.
 * @param refreshRate - Update frequency in ms (20-1000, default 1000)
 */
export function startAccelerometer(refreshRate?: number): void {
	postEvent('web_app_start_accelerometer', { refresh_rate: refreshRate });
}

/**
 * Stops accelerometer tracking.
 */
export function stopAccelerometer(): void {
	postEvent('web_app_stop_accelerometer');
}

/**
 * Subscribes to accelerometer changes.
 */
export function onAccelerometerChange(
	callback: (data: TAccelerometerData) => void,
): () => void {
	return subscribe('accelerometer_changed', callback);
}

/**
 * Starts gyroscope tracking.
 * @param refreshRate - Update frequency in ms (20-1000, default 1000)
 */
export function startGyroscope(refreshRate?: number): void {
	postEvent('web_app_start_gyroscope', { refresh_rate: refreshRate });
}

/**
 * Stops gyroscope tracking.
 */
export function stopGyroscope(): void {
	postEvent('web_app_stop_gyroscope');
}

/**
 * Subscribes to gyroscope changes.
 */
export function onGyroscopeChange(
	callback: (data: TGyroscopeData) => void,
): () => void {
	return subscribe('gyroscope_changed', callback);
}

/**
 * Starts device orientation tracking.
 * @param refreshRate - Update frequency in ms (20-1000, default 1000)
 * @param needAbsolute - Request absolute orientation if available
 */
export function startDeviceOrientation(
	refreshRate?: number,
	needAbsolute?: boolean,
): void {
	postEvent('web_app_start_device_orientation', {
		refresh_rate: refreshRate,
		need_absolute: needAbsolute,
	});
}

/**
 * Stops device orientation tracking.
 */
export function stopDeviceOrientation(): void {
	postEvent('web_app_stop_device_orientation');
}

/**
 * Subscribes to device orientation changes.
 */
export function onDeviceOrientationChange(
	callback: (data: TDeviceOrientationData) => void,
): () => void {
	return subscribe('device_orientation_changed', callback);
}

// ============================================================================
// Location
// ============================================================================

export type TLocationData = {
	available: boolean;
	latitude?: number;
	longitude?: number;
	altitude?: number;
	accuracy?: number;
	altitudeAccuracy?: number;
	heading?: number;
	speed?: number;
};

/**
 * Requests current location.
 */
export async function requestLocation(): Promise<TLocationData> {
	postEvent('web_app_request_location');
	const result = await waitForEvent('location_requested');
	return {
		available: result.available,
		latitude: result.latitude,
		longitude: result.longitude,
		altitude: result.altitude,
		accuracy: result.accuracy,
		altitudeAccuracy: result.altitude_accuracy,
		heading: result.heading,
		speed: result.speed,
	};
}

/**
 * Opens location settings.
 */
export function openLocationSettings(): void {
	postEvent('web_app_open_location_settings');
}

// ============================================================================
// Home Screen
// ============================================================================

export type THomeScreenStatus = 'unsupported' | 'unknown' | 'added' | 'missed';

/**
 * Prompts user to add app to home screen.
 */
export function addToHomeScreen(): void {
	postEvent('web_app_add_to_home_screen');
}

/**
 * Checks if app is added to home screen.
 */
export async function checkHomeScreen(): Promise<THomeScreenStatus> {
	postEvent('web_app_check_home_screen');
	const result = await waitForEvent('home_screen_checked');
	return result.status;
}

// ============================================================================
// Share
// ============================================================================

export type TShareToStoryOptions = {
	mediaUrl: string;
	text?: string;
	widgetLink?: {
		url: string;
		name?: string;
	};
};

/**
 * Shares content to Telegram story.
 */
export async function shareToStory(
	options: TShareToStoryOptions,
): Promise<boolean> {
	postEvent('web_app_share_to_story', {
		media_url: options.mediaUrl,
		text: options.text,
		widget_link: options.widgetLink,
	});

	return new Promise((resolve) => {
		const unsubSent = subscribe('share_to_story_sent', () => {
			unsubSent();
			unsubFailed();
			resolve(true);
		});
		const unsubFailed = subscribe('share_to_story_failed', () => {
			unsubSent();
			unsubFailed();
			resolve(false);
		});
	});
}

// ============================================================================
// Emoji Status
// ============================================================================

/**
 * Requests access to set user's emoji status.
 */
export async function requestEmojiStatusAccess(): Promise<boolean> {
	postEvent('web_app_request_emoji_status_access');
	const result = await waitForEvent('emoji_status_access_requested');
	return result.status === 'allowed';
}

/**
 * Sets user's emoji status.
 * @param customEmojiId - Emoji ID from Telegram
 * @param duration - Duration in seconds (optional)
 */
export async function setEmojiStatus(
	customEmojiId: string,
	duration?: number,
): Promise<boolean> {
	postEvent('web_app_set_emoji_status', {
		custom_emoji_id: customEmojiId,
		duration,
	});

	return new Promise((resolve) => {
		const unsubSet = subscribe('emoji_status_set', () => {
			unsubSet();
			unsubFailed();
			resolve(true);
		});
		const unsubFailed = subscribe('emoji_status_failed', () => {
			unsubSet();
			unsubFailed();
			resolve(false);
		});
	});
}

// ============================================================================
// File Download
// ============================================================================

/**
 * Downloads a file.
 * @param url - File URL
 * @param fileName - Suggested file name
 */
export async function downloadFile(
	url: string,
	fileName: string,
): Promise<boolean> {
	postEvent('web_app_download_file', { url, file_name: fileName });
	const result = await waitForEvent('file_download_requested');
	return result.status === 'downloading';
}

// ============================================================================
// Prepared Messages
// ============================================================================

/**
 * Sends a prepared message.
 * @param id - Prepared message ID
 */
export async function sendPreparedMessage(id: string): Promise<boolean> {
	postEvent('web_app_send_prepared_message', { id });

	return new Promise((resolve) => {
		const unsubSent = subscribe('prepared_message_sent', () => {
			unsubSent();
			unsubFailed();
			resolve(true);
		});
		const unsubFailed = subscribe('prepared_message_failed', () => {
			unsubSent();
			unsubFailed();
			resolve(false);
		});
	});
}

// ============================================================================
// Cloud Storage (via Custom Methods)
// ============================================================================

let storageReqId = 0;

/**
 * Saves a value to cloud storage.
 */
export async function cloudStorageSet(
	key: string,
	value: string,
): Promise<boolean> {
	const reqId = `storage_${++storageReqId}`;
	postEvent('web_app_invoke_custom_method', {
		req_id: reqId,
		method: 'saveStorageValue',
		params: { key, value },
	});

	return new Promise((resolve) => {
		const unsubscribe = subscribe('custom_method_invoked', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				resolve(!data.error);
			}
		});
	});
}

/**
 * Gets a value from cloud storage.
 */
export async function cloudStorageGet(
	key: string,
): Promise<string | undefined> {
	const reqId = `storage_${++storageReqId}`;
	postEvent('web_app_invoke_custom_method', {
		req_id: reqId,
		method: 'getStorageValues',
		params: { keys: [key] },
	});

	return new Promise((resolve) => {
		const unsubscribe = subscribe('custom_method_invoked', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				const result = data.result as Record<string, string> | undefined;
				resolve(result?.[key]);
			}
		});
	});
}

/**
 * Gets multiple values from cloud storage.
 */
export async function cloudStorageGetMany(
	keys: string[],
): Promise<Record<string, string>> {
	const reqId = `storage_${++storageReqId}`;
	postEvent('web_app_invoke_custom_method', {
		req_id: reqId,
		method: 'getStorageValues',
		params: { keys },
	});

	return new Promise((resolve) => {
		const unsubscribe = subscribe('custom_method_invoked', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				resolve((data.result as Record<string, string>) || {});
			}
		});
	});
}

/**
 * Deletes a value from cloud storage.
 */
export async function cloudStorageDelete(key: string): Promise<boolean> {
	const reqId = `storage_${++storageReqId}`;
	postEvent('web_app_invoke_custom_method', {
		req_id: reqId,
		method: 'deleteStorageValues',
		params: { keys: [key] },
	});

	return new Promise((resolve) => {
		const unsubscribe = subscribe('custom_method_invoked', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				resolve(!data.error);
			}
		});
	});
}

/**
 * Gets all keys from cloud storage.
 */
export async function cloudStorageKeys(): Promise<string[]> {
	const reqId = `storage_${++storageReqId}`;
	postEvent('web_app_invoke_custom_method', {
		req_id: reqId,
		method: 'getStorageKeys',
		params: {},
	});

	return new Promise((resolve) => {
		const unsubscribe = subscribe('custom_method_invoked', (data) => {
			if (data.req_id === reqId) {
				unsubscribe();
				resolve((data.result as string[]) || []);
			}
		});
	});
}
