import type { RouteRecordRaw } from 'vue-router';

export const modalRoutes: RouteRecordRaw[] = [
	{ path: '/', component: { render: () => null } },
	{
		path: '/login',
		component: () => import('@/pages/modals/login'),
	},
	{
		path: '/verify-identity',
		children: [
			{ path: '', redirect: 'step1' },
			{
				path: 'step1',
				component: () => import('@/pages/modals/verify-identity/step1'),
			},
			{
				path: 'step2',
				component: () => import('@/pages/modals/verify-identity/step2'),
			},
		],
	},
];
