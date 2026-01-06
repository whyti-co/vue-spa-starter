import { defineComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useBiometry, useHaptics, usePlatform } from '@/core/platform';

export default defineComponent({
	name: 'PlatformExample',
	setup() {
		const { platform, capabilities, isPWA, isTMA } = usePlatform();
		const haptics = useHaptics();
		const biometry = useBiometry();

		const biometryStatus = ref<string>('');

		async function requestAccess() {
			biometryStatus.value = 'Requesting access...';
			const granted = await biometry.requestAccess('To secure your account');
			biometryStatus.value = granted ? 'Access granted' : 'Access denied';
		}

		async function testBiometry() {
			// Request access first if not granted
			if (!biometry.accessGranted) {
				biometryStatus.value = 'Requesting access...';
				const granted = await biometry.requestAccess(
					'To test biometric authentication',
				);
				if (!granted) {
					biometryStatus.value = 'Access denied';
					return;
				}
			}

			biometryStatus.value = 'Authenticating...';
			const success = await biometry.authenticate('Test authentication');
			biometryStatus.value = success ? 'Success!' : 'Failed';
		}

		return () => (
			<>
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">Platform Detection</h2>
					<div class="space-y-1 text-sm">
						<p>
							Platform: <span class="badge">{platform.value}</span>
						</p>
						<p>Is PWA: {isPWA() ? 'Yes' : 'No'}</p>
						<p>Is TMA: {isTMA() ? 'Yes' : 'No'}</p>
					</div>
					{isTMA() && (
						<RouterLink
							to="/examples/platform/tma"
							class="btn btn-sm btn-primary mt-3"
						>
							TMA Features
						</RouterLink>
					)}
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
					<div class="text-sm mb-3 space-y-1 text-base-content/70">
						<p>Available: {biometry.available ? 'Yes' : 'No'}</p>
						{biometry.type && <p>Type: {biometry.type}</p>}
						<p>Access Granted: {biometry.accessGranted ? 'Yes' : 'No'}</p>
						{biometryStatus.value && (
							<p class="text-primary">{biometryStatus.value}</p>
						)}
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							class="btn btn-sm"
							onClick={requestAccess}
							disabled={!biometry.available || biometry.accessGranted}
						>
							Request Access
						</button>
						<button
							class="btn btn-primary btn-sm"
							onClick={testBiometry}
							disabled={!biometry.available}
						>
							Authenticate
						</button>
						<button
							class="btn btn-sm"
							onClick={() => biometry.openSettings()}
							disabled={!biometry.available}
						>
							Settings
						</button>
					</div>
				</div>
			</>
		);
	},
});
