import { EPlatform, type TPlatformAdapter } from '../types';

const adapter: TPlatformAdapter = {
	id: EPlatform.Browser,

	capabilities: {
		haptics: false,
		biometry: false,
		themeSync: false,
		cloudStorage: false,
		share: 'share' in navigator,
		notifications: 'Notification' in window,
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
		// No initialization needed for browser
	},

	destroy: () => {
		// No cleanup needed
	},
};

export default adapter;
