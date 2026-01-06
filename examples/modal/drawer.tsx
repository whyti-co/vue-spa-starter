/**
 * Responsive Drawer Example
 *
 * Demonstrates the responsive modal system:
 * - Mobile (<768px): Bottom drawer that slides up from dock
 * - Desktop (>=768px): Centered dialog modal
 */

import { defineComponent, ref } from 'vue';
import { isDialogMode, isDrawerMode, steps, useModal } from '@/core/modal';

export default defineComponent({
	name: 'DrawerExample',
	setup() {
		const { open } = useModal();
		const result = ref<string | null>(null);

		async function openLoginModal() {
			result.value = null;
			const res = await open<{ success?: boolean }>('/login');
			result.value = res?.success ? 'Login successful!' : 'Modal closed';
		}

		async function openTosModal() {
			result.value = null;
			await open('/tos');
			result.value = 'ToS modal closed';
		}

		async function openVerifyModal() {
			result.value = null;
			steps.set([
				{ id: 'info', path: '/verify-identity/step1', label: 'Personal Info' },
				{ id: 'docs', path: '/verify-identity/step2', label: 'Documents' },
			]);
			const res = await open<{ success?: boolean }>('/verify-identity/step1');
			result.value = res?.success
				? 'Verification complete!'
				: 'Verification cancelled';
		}

		return () => (
			<>
				<div class="alert alert-info">
					<div>
						<p class="font-medium">
							Current mode:{' '}
							{isDrawerMode.value
								? 'Drawer (mobile)'
								: isDialogMode.value
									? 'Dialog (desktop)'
									: 'Closed'}
						</p>
						<p class="text-sm opacity-70">
							Resize window to see mode change. Mobile (&lt;768px) shows bottom
							drawer, desktop shows centered dialog.
						</p>
					</div>
				</div>
				<div class="card bg-base-200 p-4 space-y-3">
					<button class="btn btn-primary w-full" onClick={openLoginModal}>
						Open Login Modal
					</button>
					<button class="btn btn-secondary w-full" onClick={openTosModal}>
						Open Terms of Service
					</button>
					<button class="btn btn-accent w-full" onClick={openVerifyModal}>
						Open Verification Wizard
					</button>
				</div>
				{result.value && (
					<div class="alert alert-success">
						<span>{result.value}</span>
					</div>
				)}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Features</h2>
					<ul class="list-disc list-inside space-y-2 text-sm text-base-content/80">
						<li>
							<strong>Drawer mode:</strong> Dock expands into bottom drawer with
							overlay
						</li>
						<li>
							<strong>Dialog mode:</strong> Centered modal with backdrop blur
						</li>
						<li>
							<strong>Smooth transitions:</strong> Height, border-radius, and
							content animations
						</li>
						<li>
							<strong>Click overlay:</strong> Closes modal in both modes
						</li>
						<li>
							<strong>Multi-step support:</strong> Stepper and page transitions
							work in drawer
						</li>
					</ul>
				</div>
			</>
		);
	},
});
