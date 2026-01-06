/**
 * Telegram Mini App Bridge Types
 *
 * Minimal type definitions for TMA communication.
 */

// Methods that can be sent to Telegram
export type TPostEventMap = {
	// Lifecycle
	web_app_ready: never;
	web_app_close: never;
	web_app_expand: never;
	web_app_request_viewport: never;
	web_app_request_theme: never;
	web_app_request_safe_area: never;
	web_app_request_content_safe_area: never;
	web_app_request_fullscreen: never;
	web_app_exit_fullscreen: never;

	// Behavior
	web_app_setup_swipe_behavior: { allow_vertical_swipe: boolean };
	web_app_setup_closing_behavior: { need_confirmation: boolean };

	// Data
	web_app_data_send: { data: string };
	web_app_switch_inline_query: { query: string; chat_types?: string[] };

	// UI
	web_app_setup_back_button: { is_visible: boolean };
	web_app_setup_main_button: {
		is_visible?: boolean;
		is_active?: boolean;
		is_progress_visible?: boolean;
		text?: string;
		color?: string;
		text_color?: string;
	};
	web_app_setup_secondary_button: {
		is_visible?: boolean;
		is_active?: boolean;
		is_progress_visible?: boolean;
		text?: string;
		color?: string;
		text_color?: string;
		position?: 'left' | 'right' | 'top' | 'bottom';
	};
	web_app_setup_settings_button: { is_visible: boolean };
	web_app_set_header_color: { color_key?: string; color?: string };
	web_app_set_background_color: { color: string };
	web_app_set_bottom_bar_color: { color: string };

	// Haptics
	web_app_trigger_haptic_feedback:
		| {
				type: 'impact';
				impact_style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
		  }
		| {
				type: 'notification';
				notification_type: 'error' | 'success' | 'warning';
		  }
		| { type: 'selection_change' };

	// Links & Popups
	web_app_open_link: { url: string; try_instant_view?: boolean };
	web_app_open_tg_link: { path_full: string };
	web_app_open_popup: {
		title?: string;
		message: string;
		buttons: Array<{
			id?: string;
			type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
			text?: string;
		}>;
	};
	web_app_open_scan_qr_popup: { text?: string };
	web_app_close_scan_qr_popup: never;

	// Clipboard
	web_app_read_text_from_clipboard: { req_id: string };

	// Biometry
	web_app_biometry_get_info: never;
	web_app_biometry_request_access: { reason?: string };
	web_app_biometry_request_auth: { reason?: string };
	web_app_biometry_update_token: { token: string };
	web_app_biometry_open_settings: never;

	// Permissions
	web_app_request_write_access: never;
	web_app_request_phone: never;

	// Invoices
	web_app_open_invoice: { slug: string };

	// Device Sensors
	web_app_start_accelerometer: { refresh_rate?: number };
	web_app_stop_accelerometer: never;
	web_app_start_gyroscope: { refresh_rate?: number };
	web_app_stop_gyroscope: never;
	web_app_start_device_orientation: {
		refresh_rate?: number;
		need_absolute?: boolean;
	};
	web_app_stop_device_orientation: never;

	// Location
	web_app_request_location: never;
	web_app_open_location_settings: never;

	// Home Screen
	web_app_add_to_home_screen: never;
	web_app_check_home_screen: never;

	// Share
	web_app_share_to_story: {
		media_url: string;
		text?: string;
		widget_link?: {
			url: string;
			name?: string;
		};
	};

	// Emoji Status
	web_app_request_emoji_status_access: never;
	web_app_set_emoji_status: {
		custom_emoji_id: string;
		duration?: number;
	};

	// File Download
	web_app_download_file: {
		url: string;
		file_name: string;
	};

	// Prepared Messages
	web_app_send_prepared_message: { id: string };

	// Custom Methods / Storage
	web_app_invoke_custom_method: {
		req_id: string;
		method: string;
		params?: unknown;
	};
};

// Events received from Telegram
export type TEventMap = {
	// Lifecycle
	viewport_changed: {
		height: number;
		width?: number;
		is_expanded: boolean;
		is_state_stable: boolean;
		is_fullscreen?: boolean;
	};
	theme_changed: { theme_params: TThemeParams };
	visibility_changed: { is_visible: boolean };
	fullscreen_changed: { is_fullscreen: boolean };
	fullscreen_failed: { error: string };

	// Buttons
	back_button_pressed: never;
	main_button_pressed: never;
	secondary_button_pressed: never;
	settings_button_pressed: never;

	// Popups
	popup_closed: { button_id?: string };
	qr_text_received: { data?: string };
	scan_qr_popup_closed: never;

	// Clipboard
	clipboard_text_received: { req_id: string; data?: string };

	// Safe areas
	safe_area_changed: {
		top: number;
		bottom: number;
		left: number;
		right: number;
	};
	content_safe_area_changed: {
		top: number;
		bottom: number;
		left: number;
		right: number;
	};

	// Biometry
	biometry_info_received: {
		available: boolean;
		type?: 'finger' | 'face';
		access_requested?: boolean;
		access_granted?: boolean;
		device_id?: string;
		token_saved?: boolean;
	};
	biometry_auth_requested: { status: 'authorized' | 'failed'; token?: string };
	biometry_token_updated: { status: 'updated' | 'removed' | 'failed' };

	// Permissions
	write_access_requested: { status: 'allowed' | 'cancelled' };
	phone_requested: { status: 'sent' | 'cancelled' };

	// Invoice
	invoice_closed: {
		slug: string;
		status: 'paid' | 'cancelled' | 'failed' | 'pending';
	};

	// Custom methods
	custom_method_invoked: { req_id: string; result?: unknown; error?: string };

	// Device Sensors
	accelerometer_started: never;
	accelerometer_stopped: never;
	accelerometer_changed: { x: number; y: number; z: number };
	accelerometer_failed: { error: string };
	gyroscope_started: never;
	gyroscope_stopped: never;
	gyroscope_changed: { x: number; y: number; z: number };
	gyroscope_failed: { error: string };
	device_orientation_started: never;
	device_orientation_stopped: never;
	device_orientation_changed: {
		alpha: number;
		beta: number;
		gamma: number;
		absolute: boolean;
	};
	device_orientation_failed: { error: string };

	// Location
	location_checked: { available: boolean };
	location_requested: {
		available: boolean;
		latitude?: number;
		longitude?: number;
		altitude?: number;
		accuracy?: number;
		altitude_accuracy?: number;
		heading?: number;
		speed?: number;
	};

	// Home Screen
	home_screen_added: never;
	home_screen_checked: {
		status: 'unsupported' | 'unknown' | 'added' | 'missed';
	};
	home_screen_failed: { error: string };

	// Share
	share_to_story_sent: never;
	share_to_story_failed: { error: string };

	// Emoji Status
	emoji_status_access_requested: { status: 'allowed' | 'cancelled' };
	emoji_status_set: never;
	emoji_status_failed: { error: string };

	// File Download
	file_download_requested: { status: 'downloading' | 'cancelled' };

	// Prepared Messages
	prepared_message_sent: never;
	prepared_message_failed: { error: string };
};

export type TThemeParams = {
	bg_color?: string;
	text_color?: string;
	hint_color?: string;
	link_color?: string;
	button_color?: string;
	button_text_color?: string;
	secondary_bg_color?: string;
	header_bg_color?: string;
	bottom_bar_bg_color?: string;
	accent_text_color?: string;
	section_bg_color?: string;
	section_header_text_color?: string;
	section_separator_color?: string;
	subtitle_text_color?: string;
	destructive_text_color?: string;
};

export type TLaunchParams = {
	version: string;
	platform: string;
	initData: string;
	initDataUnsafe: TInitDataUnsafe;
	themeParams: TThemeParams;
	startParam?: string;
};

export type TInitDataUnsafe = {
	query_id?: string;
	user?: {
		id: number;
		is_bot?: boolean;
		first_name: string;
		last_name?: string;
		username?: string;
		language_code?: string;
		is_premium?: boolean;
		photo_url?: string;
	};
	receiver?: {
		id: number;
		is_bot?: boolean;
		first_name: string;
		last_name?: string;
		username?: string;
		photo_url?: string;
	};
	chat?: {
		id: number;
		type: 'group' | 'supergroup' | 'channel';
		title: string;
		username?: string;
		photo_url?: string;
	};
	chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
	chat_instance?: string;
	start_param?: string;
	can_send_after?: number;
	auth_date: number;
	hash: string;
};
