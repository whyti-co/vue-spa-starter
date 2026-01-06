/**
 * Safe Area CSS Variables Utility
 *
 * Sets CSS custom properties for safe area insets that can be used
 * by components with fallbacks to env(safe-area-inset-*).
 */

export type TSafeAreaInsets = {
	top: number;
	bottom: number;
	left: number;
	right: number;
};

/**
 * Syncs safe area insets to CSS custom properties.
 *
 * Sets both --safe-area-* (device edges) and --content-safe-area-*
 * (app-specific like TMA header) variables.
 *
 * @example
 * ```ts
 * syncSafeAreaToCSSVariables(
 *   { top: 44, bottom: 34, left: 0, right: 0 },
 *   { top: 88, bottom: 0, left: 0, right: 0 }
 * );
 * ```
 *
 * Usage in CSS:
 * ```css
 * padding-top: var(--safe-area-top, env(safe-area-inset-top));
 * padding-top: var(--content-safe-area-top, 0px);
 * ```
 */
export function syncSafeAreaToCSSVariables(
	safeArea: TSafeAreaInsets,
	contentSafeArea?: TSafeAreaInsets,
): void {
	const root = document.documentElement;

	// Safe area (device edges - notch, home indicator)
	root.style.setProperty('--safe-area-top', `${safeArea.top}px`);
	root.style.setProperty('--safe-area-bottom', `${safeArea.bottom}px`);
	root.style.setProperty('--safe-area-left', `${safeArea.left}px`);
	root.style.setProperty('--safe-area-right', `${safeArea.right}px`);

	// Content safe area (platform-specific like TMA header)
	if (contentSafeArea) {
		root.style.setProperty(
			'--content-safe-area-top',
			`${contentSafeArea.top}px`,
		);
		root.style.setProperty(
			'--content-safe-area-bottom',
			`${contentSafeArea.bottom}px`,
		);
		root.style.setProperty(
			'--content-safe-area-left',
			`${contentSafeArea.left}px`,
		);
		root.style.setProperty(
			'--content-safe-area-right',
			`${contentSafeArea.right}px`,
		);
	}
}
