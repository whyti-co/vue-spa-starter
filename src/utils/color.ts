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

/**
 * DaisyUI theme colors resolved from CSS variables.
 */
export type TDaisyUIColors = {
	base100: string;
	base200: string;
	base300: string;
	baseContent: string;
	primary: string;
	primaryContent: string;
};

function cssColorToHex(cssColor: string): string {
	if (!cssColor) return '';

	// Create element to resolve CSS variables
	const el = document.createElement('div');
	el.style.color = cssColor;
	document.body.appendChild(el);
	const computedColor = getComputedStyle(el).color;
	el.remove();

	// Use canvas to convert any color format (oklch, rgb, etc.) to RGB pixels
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = 1;
	const ctx = canvas.getContext('2d');
	if (!ctx) return cssColor;

	ctx.fillStyle = computedColor;
	ctx.fillRect(0, 0, 1, 1);
	const data = ctx.getImageData(0, 0, 1, 1).data;
	const r = data[0] ?? 0;
	const g = data[1] ?? 0;
	const b = data[2] ?? 0;

	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getDaisyUIColors(): TDaisyUIColors {
	return {
		base100: cssColorToHex('var(--color-base-100)'),
		base200: cssColorToHex('var(--color-base-200)'),
		base300: cssColorToHex('var(--color-base-300)'),
		baseContent: cssColorToHex('var(--color-base-content)'),
		primary: cssColorToHex('var(--color-primary)'),
		primaryContent: cssColorToHex('var(--color-primary-content)'),
	};
}
