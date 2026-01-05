/**
 * Layout System Example
 *
 * The PageWrapper component controls the DefaultLayout's TopBar and Dock.
 * Every page should wrap its content in PageWrapper with layout config as props.
 *
 * PageWrapper does two things:
 * 1. Updates shared layout state for TopBar/Dock visibility
 * 2. Applies its own padding based on topBar/dock visibility (isolated per page)
 */

import { defineComponent, ref } from 'vue';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?component';
import CogIcon from '@/assets/icons/cog.svg?component';
import HomeIcon from '@/assets/icons/home.svg?component';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';

// Example 1: Default layout (topBar hidden, dock visible)
export const DefaultLayoutExample = defineComponent({
	name: 'DefaultLayoutExample',
	setup() {
		return () => (
			<PageWrapper>
				<div>
					<h2 class="text-xl font-bold">Default Layout</h2>
					<p>TopBar: hidden, Dock: visible</p>
				</div>
			</PageWrapper>
		);
	},
});

// Example 2: TopBar with title and navigation
export const TopBarWithTitleExample = defineComponent({
	name: 'TopBarWithTitleExample',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => <TopBarTitle title="Page Title" />,
						left: { icon: ArrowLeftIcon, to: '/previous-page' },
						right: { icon: CogIcon, to: '/settings' },
					},
				}}
			>
				<div>
					<p>Title: "Page Title" (centered)</p>
					<p>Left: back arrow → /previous-page</p>
					<p>Right: cog → /settings</p>
				</div>
			</PageWrapper>
		);
	},
});

// Example 3: TopBar with onClick handlers
export const TopBarOnClickExample = defineComponent({
	name: 'TopBarOnClickExample',
	setup() {
		const count = ref(0);

		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						left: {
							icon: ArrowLeftIcon,
							onClick: () => {
								count.value--;
							},
						},
						right: {
							icon: HomeIcon,
							onClick: () => {
								count.value++;
							},
						},
					},
				}}
			>
				<div>
					<h2 class="text-xl font-bold">TopBar with onClick</h2>
					<p>Left: decrement, Right: increment</p>
					<p class="text-2xl mt-4">Count: {count.value}</p>
				</div>
			</PageWrapper>
		);
	},
});

// Example 4: Hidden dock
export const HiddenDockExample = defineComponent({
	name: 'HiddenDockExample',
	setup() {
		return () => (
			<PageWrapper
				layout={{
					topBar: { visible: true, left: { icon: ArrowLeftIcon, to: '/' } },
					dock: { visible: false },
				}}
			>
				<div>
					<h2 class="text-xl font-bold">Hidden Dock</h2>
					<p>TopBar: visible with back button</p>
					<p>Dock: hidden</p>
				</div>
			</PageWrapper>
		);
	},
});

// Usage in actual pages:
//
// // Home page - defaults (no topBar, dock visible)
// <PageWrapper>
//   <div class="columns-1 sm:columns-2">
//     {/* content */}
//   </div>
// </PageWrapper>
//
// // Profile page - topBar with title and settings link
// <PageWrapper
//   layout={{
//     topBar: {
//       visible: true,
//       title: () => <TopBarTitle title={t(messages.pages.profile.title)} />,
//       left: { icon: CogIcon, to: '/profile/settings' },
//     },
//   }}
// >
//   {/* content */}
// </PageWrapper>
//
// // Settings page - topBar with title, back button, no dock
// <PageWrapper
//   layout={{
//     topBar: {
//       visible: true,
//       title: () => <TopBarTitle title={t(messages.pages.settings.title)} />,
//       left: { icon: ArrowLeftIcon, to: '/profile' },
//     },
//     dock: { visible: false },
//   }}
// >
//   {/* content */}
// </PageWrapper>
