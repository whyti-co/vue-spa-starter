import { EPlatform, type TPlatformAdapter } from '../types';

// Generic webview adapter - can be extended for specific native bridges
const adapter: TPlatformAdapter = {
	id: EPlatform.Webview,

	capabilities: {
		haptics: false,
		biometry: false,
		themeSync: false,
		cloudStorage: false,
		share: false,
		notifications: false,
	},

	haptics: {
		available: false,
		impact: () => {},
		notification: () => {},
		selectionChanged: () => {},
	},

	biometry: {
		available: false,
		type: null,
		authenticate: async () => false,
	},

	themeSync: {
		available: false,
		subscribe: () => () => {},
		setHeaderColor: () => {},
		setBackgroundColor: () => {},
	},

	init: async () => {
		// Webview initialization - extend for specific native bridges
	},

	destroy: () => {
		// Cleanup
	},
};

export default adapter;
