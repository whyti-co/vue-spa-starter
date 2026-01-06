/**
 * Color Utilities
 */

/**
 * Checks if a hex color is light (luminance > 0.5).
 * Useful for determining if text should be dark or light.
 *
 * @param hex - Hex color string (with or without #)
 * @returns true if the color is light
 */
export function isLightColor(hex: string): boolean {
	// Remove # if present
	const color = hex.replace('#', '');

	// Handle 3-character hex
	const fullHex =
		color.length === 3
			? color
					.split('')
					.map((c) => c + c)
					.join('')
			: color;

	const r = Number.parseInt(fullHex.slice(0, 2), 16);
	const g = Number.parseInt(fullHex.slice(2, 4), 16);
	const b = Number.parseInt(fullHex.slice(4, 6), 16);

	// Calculate relative luminance using sRGB coefficients
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
}

/**
 * Checks if a hex color is dark (luminance <= 0.5).
 *
 * @param hex - Hex color string (with or without #)
 * @returns true if the color is dark
 */
export function isDarkColor(hex: string): boolean {
	return !isLightColor(hex);
}

/**
 * Determines appropriate color scheme based on background color.
 *
 * @param bgColor - Background hex color
 * @returns 'light' if bg is light (use dark text), 'dark' if bg is dark (use light text)
 */
export function getColorScheme(bgColor: string): 'light' | 'dark' {
	return isLightColor(bgColor) ? 'light' : 'dark';
}
