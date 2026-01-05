import { createApp } from 'vue';
import '@/style.css';
import App from '@/App';
import { setupPageTransition } from '@/core/composables/usePageTransition';
import '@/core/composables/useTheme';
import { createI18n } from '@/core/i18n';
import { modalRouter, useModal } from '@/core/modal';
import { pinia } from '@/core/pinia';
import { initPlatform } from '@/core/platform';
import { initPlugins } from '@/core/plugins';
import { router, setupRouterGuard } from '@/core/router';
import { useSession } from '@/core/session';
import { useAuth } from '@/domains/auth';
import { loadEnabledPlugins } from '@/plugins';

async function init() {
	const app = createApp(App);
	app.use(pinia);

	// Initialize platform (detect TMA, PWA, etc.)
	await initPlatform();

	setupRouterGuard(useSession(), useModal());
	setupPageTransition(router);

	// Initialize plugins
	const plugins = await loadEnabledPlugins();
	await initPlugins(plugins, { app, router, modalRouter, pinia });

	const [i18n] = await Promise.all([createI18n(), useAuth().init()]);

	app.use(i18n).use(router).mount('#app');
}

init();
