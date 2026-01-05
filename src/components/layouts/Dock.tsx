import {
	defineComponent,
	type FunctionalComponent,
	h,
	type SVGAttributes,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HomeIcon from '@/assets/icons/home.svg?component';
import ProfileIcon from '@/assets/icons/profile.svg?component';

type TNavItem = {
	path: string;
	label: string;
	icon: FunctionalComponent<SVGAttributes>;
};

export default defineComponent({
	name: 'Dock',
	setup() {
		const router = useRouter();
		const route = useRoute();

		const items: TNavItem[] = [
			{ path: '/', label: 'Home', icon: HomeIcon },
			{ path: '/profile', label: 'Profile', icon: ProfileIcon },
		];

		return () => (
			<div class="dock">
				{items.map((item) => (
					<button
						key={item.path}
						class={route.path === item.path ? 'dock-active' : ''}
						onClick={() => router.push(item.path)}
					>
						{h(item.icon, { class: 'h-5 w-5' })}
						<span class="dock-label">{item.label}</span>
					</button>
				))}
			</div>
		);
	},
});
