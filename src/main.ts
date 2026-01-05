import { createApp } from 'vue';
import '@/style.css';
import App from '@/App';
import { setupPageTransition } from '@/core/composables/usePageTransition';
import '@/core/composables/useTheme';
import { createI18n } from '@/core/i18n';
import { useModal } from '@/core/modal';
import { pinia } from '@/core/pinia';
import { router, setupRouterGuard } from '@/core/router';
import { useSession } from '@/core/session';
import { useAuth } from '@/domains/auth';

async function init() {
	const app = createApp(App);
	app.use(pinia);

	setupRouterGuard(useSession(), useModal());
	setupPageTransition(router);

	const [i18n] = await Promise.all([createI18n(), useAuth().init()]);

	app.use(i18n).use(router).mount('#app');
}

init();
