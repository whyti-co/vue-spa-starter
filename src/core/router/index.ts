import {
	createRouter,
	createWebHistory,
	type RouteLocationRaw,
	type RouteRecordRaw,
} from 'vue-router';
import type { useModal } from '@/core/modal';
import type { useSession } from '@/core/session';

type TSession = ReturnType<typeof useSession>;
type TModal = ReturnType<typeof useModal>;
type TMode = 'overlay' | 'block' | null;

type TGuardContext = {
	session: TSession;
	modal: (path: string, mode: 'overlay' | 'block') => Promise<boolean>;
};

type TRouteGuard = (ctx: TGuardContext) => Promise<true | RouteLocationRaw>;

declare module 'vue-router' {
	interface RouteMeta {
		guard?: TRouteGuard[];
	}
}

export const guards = {
	isAuth:
		(
			mode: TMode = 'block',
			redirectTo: RouteLocationRaw = { name: 'home' },
		): TRouteGuard =>
		async ({ session, modal }) => {
			if (session.isAuthenticated) return true;
			if (mode) {
				const success = await modal('/login', mode);
				return success ? true : redirectTo;
			}
			return redirectTo;
		},

	isVerified:
		(
			mode: TMode = 'block',
			redirectTo: RouteLocationRaw = { name: 'profile' },
		): TRouteGuard =>
		async ({ session, modal }) => {
			if (session.isVerified) return true;
			if (mode) {
				const success = await modal('/verify-identity/step1', mode);
				return success ? true : redirectTo;
			}
			return redirectTo;
		},
};

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('@/components/layouts/DefaultLayout'),
		children: [
			{
				path: '',
				name: 'home',
				component: () => import('@/pages/app/home'),
			},
			{
				path: 'profile',
				name: 'profile',
				component: () => import('@/pages/app/profile'),
				meta: { guard: [guards.isAuth('overlay')] },
			},
			{
				path: 'profile/settings',
				name: 'settings',
				component: () => import('@/pages/app/profile/settings'),
				meta: { guard: [guards.isAuth(null, { name: 'profile' })] },
			},
		],
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import('@/pages/app/404'),
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

export function setupRouterGuard(session: TSession, { open }: TModal) {
	router.beforeEach(async (to) => {
		const guard = to.meta.guard;
		if (!guard?.length) return true;

		const modal = async (
			path: string,
			mode: 'overlay' | 'block',
		): Promise<boolean> => {
			if (mode === 'block') {
				const result = await open<{ success: boolean }>(path);
				return result?.success ?? false;
			}
			// overlay: navigate first, show modal after
			setTimeout(async () => {
				const result = await open<{ success: boolean }>(path);
				if (!result?.success) {
					router.push({ name: 'home' });
				}
			}, 0);
			return true;
		};

		for (const g of guard) {
			const result = await g({ session, modal });
			if (result !== true) return result;
		}
		return true;
	});
}
