import { getPluginDetectors } from './adapters';
import { EPlatform } from './types';

export function detectPlatform(): EPlatform {
	// Check plugin-registered detectors (in config order)
	for (const [platform, detector] of getPluginDetectors()) {
		if (detector()) {
			return platform;
		}
	}

	// Default to browser
	return EPlatform.Browser;
}
