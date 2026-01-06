import { defineComponent, h, type FunctionalComponent, type SVGAttributes } from 'vue';
import Avatar from '@/components/Avatar';
import PageWrapper from '@/components/PageWrapper';
import HomeIcon from '@/assets/icons/home.svg?component';
import ProfileIcon from '@/assets/icons/profile.svg?component';
import CogIcon from '@/assets/icons/cog.svg?component';
import GlobeIcon from '@/assets/icons/globe.svg?component';
import LockIcon from '@/assets/icons/lock.svg?component';
import DocumentIcon from '@/assets/icons/document.svg?component';
import SearchIcon from '@/assets/icons/search-off.svg?component';
import EmailIcon from '@/assets/icons/email.svg?component';

type TPlaceholder = {
	id: number;
	icon: FunctionalComponent<SVGAttributes>;
	gradient: string;
	height: string;
	author: string;
	label: string;
};

const placeholders: TPlaceholder[] = [
	{ id: 1, icon: HomeIcon, gradient: 'from-blue-400/40 to-cyan-600/40', height: 'h-48', author: 'Alice', label: 'Home' },
	{ id: 2, icon: ProfileIcon, gradient: 'from-purple-300/30 to-pink-400/30', height: 'h-64', author: 'Bob', label: 'Profile' },
	{ id: 3, icon: CogIcon, gradient: 'from-orange-500/50 to-amber-700/50', height: 'h-52', author: 'Charlie', label: 'Settings' },
	{ id: 4, icon: GlobeIcon, gradient: 'from-green-300/25 to-emerald-500/25', height: 'h-56', author: 'Diana', label: 'World' },
	{ id: 5, icon: LockIcon, gradient: 'from-red-600/60 to-rose-800/60', height: 'h-48', author: 'Eve', label: 'Security' },
	{ id: 6, icon: DocumentIcon, gradient: 'from-indigo-200/20 to-violet-400/20', height: 'h-72', author: 'Frank', label: 'Documents' },
	{ id: 7, icon: SearchIcon, gradient: 'from-slate-400/45 to-gray-600/45', height: 'h-52', author: 'Grace', label: 'Search' },
	{ id: 8, icon: EmailIcon, gradient: 'from-teal-500/55 to-cyan-700/55', height: 'h-60', author: 'Henry', label: 'Messages' },
];

export default defineComponent({
	name: 'HomePage',
	setup() {
		return () => (
			<PageWrapper>
				<div class="flex items-center justify-center py-2">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
							<span class="text-primary-content font-bold text-lg">A</span>
						</div>
						<span class="font-semibold text-lg tracking-tight">App</span>
					</div>
				</div>
				<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
					{placeholders.map((item) => (
						<div key={item.id} class="card bg-base-200 break-inside-avoid overflow-hidden">
							<figure>
								<div class={`${item.height} w-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
									{h(item.icon, { class: 'w-12 h-12 text-base-content/30' })}
								</div>
							</figure>
							<div class="card-body p-3">
								<div class="flex items-center gap-2">
									<Avatar letter={item.author[0]} size="sm" />
									<div>
										<p class="text-sm font-medium">{item.author}</p>
										<p class="text-xs text-base-content/60">{item.label}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</PageWrapper>
		);
	},
});
