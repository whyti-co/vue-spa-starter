import {
	type Component,
	type InjectionKey,
	inject,
	markRaw,
	onActivated,
	onMounted,
	provide,
	reactive,
	type VNode,
} from 'vue';

export type TLayoutAction = {
	icon: Component;
} & ({ to: string } | { onClick: () => void });

type TLayoutState = {
	topBar: {
		visible: boolean;
		title: (() => VNode) | null;
		left: TLayoutAction | null;
		right: TLayoutAction | null;
	};
	dock: {
		visible: boolean;
	};
};

export type TLayoutConfig = {
	topBar?: {
		visible?: boolean;
		title?: (() => VNode) | null;
		left?: TLayoutAction | null;
		right?: TLayoutAction | null;
	};
	dock?: {
		visible?: boolean;
	};
};

const defaultConfig: TLayoutState = {
	topBar: { visible: false, title: null, left: null, right: null },
	dock: { visible: true },
};

const layoutKey: InjectionKey<TLayoutState> = Symbol('layout');

export function provideLayout() {
	const state = reactive<TLayoutState>({
		topBar: { ...defaultConfig.topBar },
		dock: { ...defaultConfig.dock },
	});

	provide(layoutKey, state);

	return state;
}

export function useLayout(config?: TLayoutConfig) {
	const state = inject(layoutKey);
	if (!state) {
		throw new Error('useLayout must be used within a Layout provider');
	}

	const applyConfig = () => {
		if (config) {
			state.topBar.visible =
				config.topBar?.visible ?? defaultConfig.topBar.visible;
			state.topBar.title = config.topBar?.title ?? defaultConfig.topBar.title;
			state.topBar.left = config.topBar?.left
				? markRaw(config.topBar.left)
				: defaultConfig.topBar.left;
			state.topBar.right = config.topBar?.right
				? markRaw(config.topBar.right)
				: defaultConfig.topBar.right;
			state.dock.visible = config.dock?.visible ?? defaultConfig.dock.visible;
		}
	};

	// Apply on mount and when restored from KeepAlive cache
	onMounted(applyConfig);
	onActivated(applyConfig);

	return state;
}
