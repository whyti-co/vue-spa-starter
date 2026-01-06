import { defineComponent, ref } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import CogIcon from '@/assets/icons/cog.svg?component';
import HomeIcon from '@/assets/icons/home.svg?component';

// Example 1: Default layout (topBar hidden, dock visible)
export const DefaultLayoutExample = defineComponent({
	name: 'DefaultLayoutExample',
	setup() {
		return () => (
			<div class="space-y-3">
				<p class="text-sm text-base-content/70">
					No layout prop needed. TopBar hidden, Dock visible.
				</p>
				<pre class="bg-base-300 p-3 rounded-xl text-xs overflow-x-auto">
					{`<PageWrapper>
  {/* content */}
</PageWrapper>`}
				</pre>
			</div>
		);
	},
});

// Example 2: TopBar with title and navigation
export const TopBarWithTitleExample = defineComponent({
	name: 'TopBarWithTitleExample',
	setup() {
		return () => (
			<div class="space-y-3">
				<div class="flex items-center gap-2 text-sm">
					<ArrowLeftIcon class="h-4 w-4" />
					<span class="flex-1 text-center font-semibold">Page Title</span>
					<CogIcon class="h-4 w-4" />
				</div>
				<p class="text-sm text-base-content/70">
					TopBar with centered title and navigation icons.
				</p>
				<pre class="bg-base-300 p-3 rounded-xl text-xs overflow-x-auto">
					{`<PageWrapper
  layout={{
    topBar: {
      visible: true,
      title: () => <TopBarTitle title="Page Title" />,
      left: { icon: ArrowLeftIcon, to: '/back' },
      right: { icon: CogIcon, to: '/settings' },
    },
  }}
/>`}
				</pre>
			</div>
		);
	},
});

// Example 3: TopBar with onClick handlers
export const TopBarOnClickExample = defineComponent({
	name: 'TopBarOnClickExample',
	setup() {
		const count = ref(0);

		return () => (
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<button
						class="btn btn-ghost btn-sm btn-square"
						onClick={() => count.value--}
					>
						<ArrowLeftIcon class="h-4 w-4" />
					</button>
					<span class="flex-1 text-center text-2xl font-bold">
						{count.value}
					</span>
					<button
						class="btn btn-ghost btn-sm btn-square"
						onClick={() => count.value++}
					>
						<HomeIcon class="h-4 w-4" />
					</button>
				</div>
				<p class="text-sm text-base-content/70">
					Use onClick instead of to for custom handlers.
				</p>
				<pre class="bg-base-300 p-3 rounded-xl text-xs overflow-x-auto">
					{`left: { icon: ArrowLeftIcon, onClick: () => ... }
right: { icon: HomeIcon, onClick: () => ... }`}
				</pre>
			</div>
		);
	},
});

// Example 4: Hidden dock
export const HiddenDockExample = defineComponent({
	name: 'HiddenDockExample',
	setup() {
		return () => (
			<div class="space-y-3">
				<p class="text-sm text-base-content/70">
					Hide the dock for settings or modal-like pages.
				</p>
				<pre class="bg-base-300 p-3 rounded-xl text-xs overflow-x-auto">
					{`<PageWrapper
  layout={{
    topBar: { visible: true, ... },
    dock: { visible: false },
  }}
/>`}
				</pre>
			</div>
		);
	},
});
