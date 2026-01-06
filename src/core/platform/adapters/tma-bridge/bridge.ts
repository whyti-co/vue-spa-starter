/**
 * Telegram Mini App Bridge
 *
 * Core communication layer between Mini App and Telegram client.
 * Handles both sending events (postEvent) and receiving events (subscribe).
 */

import type { TEventMap, TPostEventMap } from './types';

// Global declarations for Telegram environments
declare global {
	interface Window {
		// Native TMA environments (iOS, Android, macOS, Desktop)
		TelegramWebviewProxy?: {
			postEvent: (eventType: string, eventData: string) => void;
		};
		// Event receiver set by Telegram
		TelegramGameProxy_receiveEvent?: (
			eventType: string,
			eventData: unknown,
		) => void;
		TelegramGameProxy?: {
			receiveEvent: (eventType: string, eventData: unknown) => void;
		};
	}
}

// Legacy Windows Phone external interface (separate from Window.external)
type TLegacyExternal = { notify?: (message: string) => void };

function getLegacyExternal(): TLegacyExternal | undefined {
	return (window as { external?: TLegacyExternal }).external;
}

type TEventCallback<K extends keyof TEventMap> = TEventMap[K] extends never
	? () => void
	: (data: TEventMap[K]) => void;

// Store event listeners
const listeners = new Map<string, Set<TEventCallback<any>>>();

/**
 * Detects the current TMA environment.
 */
function detectEnvironment(): 'iframe' | 'native' | 'legacy' | 'unknown' {
	if (typeof window === 'undefined') return 'unknown';

	// Check for native TMA (iOS, Android, macOS, Desktop)
	if (window.TelegramWebviewProxy?.postEvent) {
		return 'native';
	}

	// Check for legacy Android / Windows Phone
	if (getLegacyExternal()?.notify) {
		return 'legacy';
	}

	// Check if running in iframe (web version)
	if (window.parent !== window) {
		return 'iframe';
	}

	return 'unknown';
}

/**
 * Gets the target origin for postMessage in iframe mode.
 */
function getTargetOrigin(): string {
	// In development, we might not have a proper origin
	// Telegram web uses https://web.telegram.org
	return '*'; // In production, you might want to restrict this
}

/**
 * Posts an event to Telegram client.
 *
 * @param event - Event name from TPostEventMap
 * @param data - Event data (optional for events with never type)
 * @returns true if event was sent, false if environment is unsupported
 */
export function postEvent<K extends keyof TPostEventMap>(
	event: K,
	...args: TPostEventMap[K] extends never ? [] : [data: TPostEventMap[K]]
): boolean {
	const data = args[0];
	const env = detectEnvironment();

	const message = {
		eventType: event,
		eventData: data,
	};

	switch (env) {
		case 'native':
			window.TelegramWebviewProxy?.postEvent(
				event,
				data === undefined ? '' : JSON.stringify(data),
			);
			return true;

		case 'legacy':
			getLegacyExternal()?.notify?.(JSON.stringify(message));
			return true;

		case 'iframe':
			window.parent.postMessage(JSON.stringify(message), getTargetOrigin());
			return true;

		default:
			console.warn(
				`[TMA Bridge] Unknown environment, cannot post event: ${event}`,
			);
			return false;
	}
}

/**
 * Handles incoming events from Telegram.
 */
function handleEvent(eventType: string, eventData: unknown): void {
	const callbacks = listeners.get(eventType);
	if (!callbacks) return;

	for (const callback of callbacks) {
		try {
			callback(eventData);
		} catch (error) {
			console.error(
				`[TMA Bridge] Error in event handler for ${eventType}:`,
				error,
			);
		}
	}
}

/**
 * Subscribes to an event from Telegram.
 *
 * @param event - Event name from TEventMap
 * @param callback - Handler function
 * @returns Unsubscribe function
 */
export function subscribe<K extends keyof TEventMap>(
	event: K,
	callback: TEventCallback<K>,
): () => void {
	if (!listeners.has(event)) {
		listeners.set(event, new Set());
	}
	listeners.get(event)?.add(callback);

	return () => {
		const callbacks = listeners.get(event);
		if (callbacks) {
			callbacks.delete(callback);
			if (callbacks.size === 0) {
				listeners.delete(event);
			}
		}
	};
}

/**
 * One-time subscription that automatically unsubscribes after receiving event.
 */
export function subscribeOnce<K extends keyof TEventMap>(
	event: K,
	callback: TEventCallback<K>,
): () => void {
	const unsubscribe = subscribe(event, ((data: TEventMap[K]) => {
		unsubscribe();
		(callback as (data: TEventMap[K]) => void)(data);
	}) as TEventCallback<K>);

	return unsubscribe;
}

/**
 * Creates a promise that resolves when the specified event is received.
 */
export function waitForEvent<K extends keyof TEventMap>(
	event: K,
	timeout?: number,
): Promise<TEventMap[K] extends never ? undefined : TEventMap[K]> {
	return new Promise((resolve, reject) => {
		const unsubscribe = subscribeOnce(event, ((data: TEventMap[K]) => {
			if (timeoutId) clearTimeout(timeoutId);
			resolve(data as TEventMap[K] extends never ? undefined : TEventMap[K]);
		}) as TEventCallback<K>);

		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		if (timeout) {
			timeoutId = setTimeout(() => {
				unsubscribe();
				reject(new Error(`[TMA Bridge] Timeout waiting for event: ${event}`));
			}, timeout);
		}
	});
}

// Flag to track initialization
let initialized = false;

/**
 * Initializes the event receiver.
 * Must be called before events can be received.
 */
export function initBridge(): void {
	if (initialized) return;
	initialized = true;

	// Set up the global event receiver for native environments
	const receiveEvent = (eventType: string, eventData: unknown) => {
		// Parse eventData if it's a string
		let data = eventData;
		if (typeof eventData === 'string') {
			try {
				data = eventData ? JSON.parse(eventData) : undefined;
			} catch {
				data = eventData;
			}
		}
		handleEvent(eventType, data);
	};

	// TelegramGameProxy is used by Telegram to send events
	window.TelegramGameProxy_receiveEvent = receiveEvent;
	if (!window.TelegramGameProxy) {
		window.TelegramGameProxy = { receiveEvent };
	} else {
		window.TelegramGameProxy.receiveEvent = receiveEvent;
	}

	// For iframe mode, listen to postMessage
	if (detectEnvironment() === 'iframe') {
		window.addEventListener('message', (event) => {
			// Try to parse the message
			let data: { eventType?: string; eventData?: unknown };
			try {
				data =
					typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
			} catch {
				return; // Not a valid TMA message
			}

			if (data.eventType) {
				handleEvent(data.eventType, data.eventData);
			}
		});
	}
}

/**
 * Checks if running in a TMA environment.
 */
export function isTMA(): boolean {
	return detectEnvironment() !== 'unknown';
}

/**
 * Gets the current environment type.
 */
export function getEnvironment(): 'iframe' | 'native' | 'legacy' | 'unknown' {
	return detectEnvironment();
}
