import { defineComponent } from 'vue';
import { usePlatform, useHaptics, useBiometry } from '@/core/platform';

export default defineComponent({
	name: 'PlatformExample',
	setup() {
		const { platform, capabilities, isPWA, isTMA } = usePlatform();
		const haptics = useHaptics();
		const biometry = useBiometry();

		async function testBiometry() {
			const success = await biometry.authenticate('Test authentication');
			console.log('Biometry result:', success);
		}

		return () => (
			<div class="p-4 space-y-4">
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">Platform Detection</h2>
					<div class="space-y-1 text-sm">
						<p>
							Platform: <span class="badge">{platform.value}</span>
						</p>
						<p>Is PWA: {isPWA() ? 'Yes' : 'No'}</p>
						<p>Is TMA: {isTMA() ? 'Yes' : 'No'}</p>
					</div>
				</div>

				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">Capabilities</h2>
					<div class="flex flex-wrap gap-2">
						{Object.entries(capabilities.value).map(([key, value]) => (
							<span class={['badge', value ? 'badge-success' : 'badge-ghost']}>
								{key}
							</span>
						))}
					</div>
				</div>

				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Haptics</h2>
					<p class="text-sm mb-3 text-base-content/70">
						Available: {haptics.available ? 'Yes' : 'No'}
					</p>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={() => haptics.impact('light')}>
							Light
						</button>
						<button class="btn btn-sm" onClick={() => haptics.impact('medium')}>
							Medium
						</button>
						<button class="btn btn-sm" onClick={() => haptics.impact('heavy')}>
							Heavy
						</button>
						<button
							class="btn btn-sm btn-success"
							onClick={() => haptics.notification('success')}
						>
							Success
						</button>
						<button
							class="btn btn-sm btn-warning"
							onClick={() => haptics.notification('warning')}
						>
							Warning
						</button>
						<button
							class="btn btn-sm btn-error"
							onClick={() => haptics.notification('error')}
						>
							Error
						</button>
					</div>
				</div>

				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Biometry</h2>
					<p class="text-sm mb-1 text-base-content/70">
						Available: {biometry.available ? 'Yes' : 'No'}
					</p>
					{biometry.type && (
						<p class="text-sm mb-3 text-base-content/70">Type: {biometry.type}</p>
					)}
					<button
						class="btn btn-primary btn-sm"
						onClick={testBiometry}
						disabled={!biometry.available}
					>
						Test Biometry
					</button>
				</div>
			</div>
		);
	},
});
