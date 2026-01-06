import { createApp } from 'vue';
import '@/style.css';
import App from '@/App';
import { setupPageTransition } from '@/core/composables/usePageTransition';
import '@/core/composables/useTheme';
import { loadEnabledPlugins } from 'virtual:plugins-loader';
import { createI18n } from '@/core/i18n';
import { modalRouter, useModal } from '@/core/modal';
import { pinia } from '@/core/pinia';
import { initPlatform } from '@/core/platform';
import { initPlugins } from '@/core/plugins';
import { router, setupRouterGuard } from '@/core/router';
import { useSession } from '@/core/session';
import { useAuth } from '@/domains/auth';

async function init() {
	const app = createApp(App);
	app.use(pinia);

	// Load plugins first (allows them to register platform adapters)
	const plugins = await loadEnabledPlugins();
	console.log(`[plugins] Enabled: ${plugins.map((p) => p.name).join(', ')}`);
	await initPlugins(plugins, { app, router, modalRouter, pinia });

	// Initialize platform (detect TMA, PWA, etc.)
	await initPlatform();

	setupRouterGuard(useSession(), useModal());
	setupPageTransition(router);

	const i18n = await createI18n();
	app.use(i18n);

	await useAuth().init();

	app.use(router).mount('#app');
}

init();
