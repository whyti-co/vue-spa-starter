import type { FunctionalComponent, SVGAttributes } from 'vue';
import CogIcon from '@/assets/icons/cog.svg?component';
import DocumentIcon from '@/assets/icons/document.svg?component';
import EmailIcon from '@/assets/icons/email.svg?component';
import GlobeIcon from '@/assets/icons/globe.svg?component';
import HomeIcon from '@/assets/icons/home.svg?component';
import LockIcon from '@/assets/icons/lock.svg?component';
import ProfileIcon from '@/assets/icons/profile.svg?component';
import SearchIcon from '@/assets/icons/search-off.svg?component';

export type TPost = {
	id: string;
	icon: FunctionalComponent<SVGAttributes>;
	gradient: string;
	height: string;
	author: string;
	title: string;
	description: string;
};

const posts: TPost[] = [
	{
		id: '1',
		icon: HomeIcon,
		gradient: 'from-blue-400/40 to-cyan-600/40',
		height: 'h-48',
		author: 'Alice',
		title: 'Home',
		description:
			'Welcome to your personal dashboard. Here you can find all your recent activities and quick access to your favorite features.',
	},
	{
		id: '2',
		icon: ProfileIcon,
		gradient: 'from-purple-300/30 to-pink-400/30',
		height: 'h-64',
		author: 'Bob',
		title: 'Profile',
		description:
			'Customize your profile settings and manage your personal information. Update your avatar, bio, and social links.',
	},
	{
		id: '3',
		icon: CogIcon,
		gradient: 'from-orange-500/50 to-amber-700/50',
		height: 'h-52',
		author: 'Charlie',
		title: 'Settings',
		description:
			'Configure your app preferences, notifications, and privacy settings. Make the app work exactly how you want it.',
	},
	{
		id: '4',
		icon: GlobeIcon,
		gradient: 'from-green-300/25 to-emerald-500/25',
		height: 'h-56',
		author: 'Diana',
		title: 'World',
		description:
			'Explore content from around the globe. Discover new places, cultures, and connect with people worldwide.',
	},
	{
		id: '5',
		icon: LockIcon,
		gradient: 'from-red-600/60 to-rose-800/60',
		height: 'h-48',
		author: 'Eve',
		title: 'Security',
		description:
			'Your security matters. Manage your passwords, two-factor authentication, and review your login history.',
	},
	{
		id: '6',
		icon: DocumentIcon,
		gradient: 'from-indigo-200/20 to-violet-400/20',
		height: 'h-72',
		author: 'Frank',
		title: 'Documents',
		description:
			'Access and manage all your important documents in one place. Upload, organize, and share files securely.',
	},
	{
		id: '7',
		icon: SearchIcon,
		gradient: 'from-slate-400/45 to-gray-600/45',
		height: 'h-52',
		author: 'Grace',
		title: 'Search',
		description:
			'Find anything quickly with our powerful search feature. Filter by date, type, or content to get exactly what you need.',
	},
	{
		id: '8',
		icon: EmailIcon,
		gradient: 'from-teal-500/55 to-cyan-700/55',
		height: 'h-60',
		author: 'Henry',
		title: 'Messages',
		description:
			'Stay connected with your team and friends. Send messages, share files, and collaborate in real-time.',
	},
];

export async function fetchPosts(): Promise<TPost[]> {
	// TODO: Replace with actual API call
	await new Promise((r) => setTimeout(r, 100));
	return posts;
}

export async function fetchPostById(id: string): Promise<TPost | null> {
	// TODO: Replace with actual API call
	await new Promise((r) => setTimeout(r, 100));
	return posts.find((p) => p.id === id) ?? null;
}

export function getPostById(id: string): TPost | undefined {
	return posts.find((p) => p.id === id);
}

export function getPosts(): TPost[] {
	return posts;
}
