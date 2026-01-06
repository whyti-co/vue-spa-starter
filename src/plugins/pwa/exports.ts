/**
 * PWA Plugin Exports
 *
 * PWA-specific functionality that can be lazy-loaded.
 */

/**
 * Check if the app is running as an installed PWA
 */
export function isPWA(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		(navigator as { standalone?: boolean }).standalone === true
	);
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<
	'granted' | 'denied' | 'default'
> {
	if (!('Notification' in window)) {
		return 'denied';
	}
	return Notification.requestPermission();
}

/**
 * Show a notification (requires permission)
 */
export async function showNotification(
	title: string,
	options?: NotificationOptions,
): Promise<Notification | null> {
	if (!('Notification' in window) || Notification.permission !== 'granted') {
		return null;
	}
	return new Notification(title, options);
}

/**
 * Share content using Web Share API
 */
export async function share(data: ShareData): Promise<boolean> {
	if (!('share' in navigator)) {
		return false;
	}
	try {
		await navigator.share(data);
		return true;
	} catch {
		// User cancelled or error
		return false;
	}
}

/**
 * Check if Web Share API is available
 */
export function canShare(data?: ShareData): boolean {
	if (!('share' in navigator)) {
		return false;
	}
	if (data && 'canShare' in navigator) {
		return navigator.canShare(data);
	}
	return true;
}

export type TPwaExports = {
	isPWA: typeof isPWA;
	requestNotificationPermission: typeof requestNotificationPermission;
	showNotification: typeof showNotification;
	share: typeof share;
	canShare: typeof canShare;
};

export default {
	isPWA,
	requestNotificationPermission,
	showNotification,
	share,
	canShare,
} satisfies TPwaExports;
