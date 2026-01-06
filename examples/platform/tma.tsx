import { computed, defineComponent, onUnmounted, ref } from 'vue';
import { useBiometry, usePlatform } from '@/core/platform';
import {
	addToHomeScreen,
	checkHomeScreen,
	closeQRScanner,
	cloudStorageDelete,
	cloudStorageGet,
	cloudStorageKeys,
	cloudStorageSet,
	downloadFile,
	exitFullscreen,
	expand,
	getUser,
	getVersion,
	hapticFeedback,
	hideMainButton,
	onAccelerometerChange,
	onBackButtonClick,
	onDeviceOrientationChange,
	onGyroscopeChange,
	onMainButtonClick,
	onSecondaryButtonClick,
	onSettingsButtonClick,
	openInvoice,
	openLink,
	openLocationSettings,
	openTelegramLink,
	readClipboard,
	requestEmojiStatusAccess,
	requestFullscreen,
	requestLocation,
	requestPhone,
	requestWriteAccess,
	scanQR,
	sendData,
	setBackButtonVisible,
	setBottomBarColor,
	setClosingConfirmation,
	setEmojiStatus,
	setHeaderColor,
	setSettingsButtonVisible,
	setSwipeEnabled,
	setupSecondaryButton,
	shareToStory,
	showMainButton,
	showPopup,
	startAccelerometer,
	startDeviceOrientation,
	startGyroscope,
	state,
	stopAccelerometer,
	stopDeviceOrientation,
	stopGyroscope,
	switchInlineQuery,
	type TAccelerometerData,
	type TDeviceOrientationData,
	type TGyroscopeData,
} from '@/core/platform/adapters/tma-bridge';

export default defineComponent({
	name: 'TMAExample',
	setup() {
		const { isTMA } = usePlatform();
		const biometry = useBiometry();
		const log = ref<string[]>([]);

		// Behavior state
		const closingConfirmation = ref(false);
		const swipeEnabled = ref(true);

		function addLog(message: string) {
			log.value = [
				`[${new Date().toLocaleTimeString()}] ${message}`,
				...log.value,
			].slice(0, 20);
		}

		// User info
		const user = computed(() => getUser());
		const version = computed(() => getVersion());

		// Viewport control
		function doExpand() {
			expand();
			addLog('Expanded');
		}

		function doFullscreen() {
			requestFullscreen();
			addLog('Requested fullscreen');
		}

		function doExitFullscreen() {
			exitFullscreen();
			addLog('Exited fullscreen');
		}

		// Behavior control
		function toggleClosingConfirmation() {
			closingConfirmation.value = !closingConfirmation.value;
			setClosingConfirmation(closingConfirmation.value);
			addLog(
				`Closing confirmation: ${closingConfirmation.value ? 'ON' : 'OFF'}`,
			);
		}

		function toggleSwipe() {
			swipeEnabled.value = !swipeEnabled.value;
			setSwipeEnabled(swipeEnabled.value);
			addLog(`Swipe: ${swipeEnabled.value ? 'enabled' : 'disabled'}`);
		}

		// Device Sensors
		const accelData = ref<TAccelerometerData | null>(null);
		const gyroData = ref<TGyroscopeData | null>(null);
		const orientData = ref<TDeviceOrientationData | null>(null);
		const accelRunning = ref(false);
		const gyroRunning = ref(false);
		const orientRunning = ref(false);
		let accelUnsub: (() => void) | null = null;
		let gyroUnsub: (() => void) | null = null;
		let orientUnsub: (() => void) | null = null;

		function toggleAccelerometer() {
			if (accelRunning.value) {
				stopAccelerometer();
				accelUnsub?.();
				accelRunning.value = false;
				accelData.value = null;
				addLog('Accelerometer stopped');
			} else {
				startAccelerometer(100);
				accelUnsub = onAccelerometerChange((data) => {
					accelData.value = data;
				});
				accelRunning.value = true;
				addLog('Accelerometer started');
			}
		}

		function toggleGyroscope() {
			if (gyroRunning.value) {
				stopGyroscope();
				gyroUnsub?.();
				gyroRunning.value = false;
				gyroData.value = null;
				addLog('Gyroscope stopped');
			} else {
				startGyroscope(100);
				gyroUnsub = onGyroscopeChange((data) => {
					gyroData.value = data;
				});
				gyroRunning.value = true;
				addLog('Gyroscope started');
			}
		}

		function toggleOrientation() {
			if (orientRunning.value) {
				stopDeviceOrientation();
				orientUnsub?.();
				orientRunning.value = false;
				orientData.value = null;
				addLog('Orientation stopped');
			} else {
				startDeviceOrientation(100);
				orientUnsub = onDeviceOrientationChange((data) => {
					orientData.value = data;
				});
				orientRunning.value = true;
				addLog('Orientation started');
			}
		}

		// Cleanup sensors on unmount
		onUnmounted(() => {
			if (accelRunning.value) stopAccelerometer();
			if (gyroRunning.value) stopGyroscope();
			if (orientRunning.value) stopDeviceOrientation();
			accelUnsub?.();
			gyroUnsub?.();
			orientUnsub?.();
		});

		// Location
		async function testLocation() {
			addLog('Requesting location...');
			try {
				const loc = await requestLocation();
				if (loc.available && loc.latitude !== undefined) {
					addLog(
						`Location: ${loc.latitude.toFixed(4)}, ${loc.longitude?.toFixed(4)}`,
					);
				} else {
					addLog('Location not available');
				}
			} catch (e) {
				addLog(`Location error: ${e}`);
			}
		}

		// Home Screen
		const homeScreenStatus = ref<string>('');

		async function testCheckHomeScreen() {
			const status = await checkHomeScreen();
			homeScreenStatus.value = status;
			addLog(`Home screen: ${status}`);
		}

		function testAddToHomeScreen() {
			addToHomeScreen();
			addLog('Prompted to add to home screen');
		}

		// Share to Story
		async function testShareStory() {
			addLog('Sharing to story...');
			const success = await shareToStory({
				mediaUrl: 'https://telegram.org/img/t_logo.png',
				text: 'Check out this Mini App!',
			});
			addLog(`Share story: ${success ? 'sent' : 'failed'}`);
		}

		// Emoji Status
		async function testEmojiStatus() {
			addLog('Requesting emoji status access...');
			const access = await requestEmojiStatusAccess();
			if (access) {
				const success = await setEmojiStatus('5368324170671202286', 3600);
				addLog(`Emoji status: ${success ? 'set' : 'failed'}`);
			} else {
				addLog('Emoji status access denied');
			}
		}

		// File Download
		async function testDownload() {
			addLog('Starting download...');
			const success = await downloadFile(
				'https://telegram.org/img/t_logo.png',
				'telegram_logo.png',
			);
			addLog(`Download: ${success ? 'started' : 'cancelled'}`);
		}

		// Cloud Storage
		const storageKey = ref('test_key');
		const storageValue = ref('');

		async function testStorageSave() {
			const success = await cloudStorageSet(
				storageKey.value,
				`value_${Date.now()}`,
			);
			addLog(`Storage save: ${success ? 'ok' : 'failed'}`);
		}

		async function testStorageLoad() {
			const value = await cloudStorageGet(storageKey.value);
			storageValue.value = value || '';
			addLog(`Storage load: ${value || '(empty)'}`);
		}

		async function testStorageDelete() {
			const success = await cloudStorageDelete(storageKey.value);
			storageValue.value = '';
			addLog(`Storage delete: ${success ? 'ok' : 'failed'}`);
		}

		async function testStorageKeys() {
			const keys = await cloudStorageKeys();
			addLog(`Storage keys: ${keys.length > 0 ? keys.join(', ') : '(none)'}`);
		}

		// Main Button
		let mainButtonUnsub: (() => void) | null = null;
		function setupMainBtn() {
			showMainButton('Click Me!', '#2481cc');
			mainButtonUnsub = onMainButtonClick(() => {
				addLog('Main button clicked!');
				hapticFeedback('notification', 'success');
			});
			addLog('Main button shown');
		}

		function hideMainBtn() {
			hideMainButton();
			mainButtonUnsub?.();
			mainButtonUnsub = null;
			addLog('Main button hidden');
		}

		// Secondary Button
		let secondaryButtonUnsub: (() => void) | null = null;
		function setupSecondaryBtn() {
			setupSecondaryButton({
				text: 'Secondary',
				isVisible: true,
				isActive: true,
				position: 'bottom',
			});
			secondaryButtonUnsub = onSecondaryButtonClick(() => {
				addLog('Secondary button clicked!');
			});
			addLog('Secondary button shown');
		}

		function hideSecondaryBtn() {
			setupSecondaryButton({ isVisible: false });
			secondaryButtonUnsub?.();
			secondaryButtonUnsub = null;
			addLog('Secondary button hidden');
		}

		// Back Button
		let backButtonUnsub: (() => void) | null = null;
		function showBackBtn() {
			setBackButtonVisible(true);
			backButtonUnsub = onBackButtonClick(() => {
				addLog('Back button clicked!');
				setBackButtonVisible(false);
				backButtonUnsub?.();
			});
			addLog('Back button shown');
		}

		// Settings Button
		let settingsButtonUnsub: (() => void) | null = null;
		function showSettingsBtn() {
			setSettingsButtonVisible(true);
			settingsButtonUnsub = onSettingsButtonClick(() => {
				addLog('Settings button clicked!');
			});
			addLog('Settings button shown');
		}

		function hideSettingsBtn() {
			setSettingsButtonVisible(false);
			settingsButtonUnsub?.();
			settingsButtonUnsub = null;
			addLog('Settings button hidden');
		}

		// Haptics
		function testHaptic(type: 'light' | 'medium' | 'heavy') {
			hapticFeedback('impact', type);
			addLog(`Haptic: ${type}`);
		}

		// QR Scanner
		async function testQR() {
			addLog('Opening QR scanner...');
			try {
				const result = await scanQR('Scan any QR code');
				addLog(`QR result: ${result || 'cancelled'}`);
			} catch (e) {
				addLog(`QR error: ${e}`);
			}
		}

		// Clipboard
		async function testClipboard() {
			const text = await readClipboard();
			addLog(`Clipboard: ${text || '(empty or denied)'}`);
		}

		// Popup
		async function testPopup() {
			const result = await showPopup({
				title: 'Test Popup',
				message: 'This is a test popup with multiple buttons',
				buttons: [
					{ id: 'ok', type: 'ok', text: 'OK' },
					{ id: 'cancel', type: 'cancel', text: 'Cancel' },
					{ id: 'delete', type: 'destructive', text: 'Delete' },
				],
			});
			addLog(`Popup result: ${result || 'closed'}`);
		}

		// Links
		function testLink() {
			openLink('https://telegram.org', true);
			addLog('Opened external link');
		}

		function testTgLink() {
			openTelegramLink('/durov');
			addLog('Opened Telegram link');
		}

		// Theme Colors
		function setHeader(color: string) {
			setHeaderColor(color);
			addLog(`Header color: ${color}`);
		}

		function setBottom(color: string) {
			setBottomBarColor(color);
			addLog(`Bottom bar color: ${color}`);
		}

		// Biometry (using unified API)
		async function testBiometryAccess() {
			addLog('Requesting biometry access...');
			try {
				const granted = await biometry.requestAccess('To secure your account');
				addLog(`Biometry access: ${granted ? 'granted' : 'denied'}`);
			} catch (e) {
				addLog(`Biometry access error: ${e}`);
			}
		}

		async function testBiometryAuth() {
			addLog('Requesting biometry auth...');
			try {
				const success = await biometry.authenticate('Confirm your identity');
				addLog(`Biometry auth: ${success ? 'success' : 'failed'}`);
			} catch (e) {
				addLog(`Biometry auth error: ${e}`);
			}
		}

		// Permissions
		async function testWriteAccess() {
			const granted = await requestWriteAccess();
			addLog(`Write access: ${granted ? 'granted' : 'denied'}`);
		}

		async function testPhoneRequest() {
			const sent = await requestPhone();
			addLog(`Phone request: ${sent ? 'sent' : 'cancelled'}`);
		}

		// Invoice (demo)
		async function testInvoice() {
			addLog('Opening invoice (demo slug)...');
			try {
				const status = await openInvoice('demo_invoice_slug');
				addLog(`Invoice status: ${status}`);
			} catch (e) {
				addLog(`Invoice error: ${e}`);
			}
		}

		// Data
		function testSendData() {
			sendData(JSON.stringify({ action: 'test', timestamp: Date.now() }));
			addLog('Sent data to bot (app will close)');
		}

		function testInlineQuery() {
			switchInlineQuery('test query', ['users', 'groups']);
			addLog('Switched to inline query');
		}

		if (!isTMA()) {
			return () => (
				<div class="p-4">
					<div class="alert alert-warning">
						This page is only available in Telegram Mini App environment.
					</div>
				</div>
			);
		}

		return () => (
			<div class="p-4 space-y-4 pb-20">
				{/* User Info */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">User & Environment</h2>
					<div class="text-sm space-y-1">
						<p>
							Version: <span class="badge badge-sm">{version.value}</span>
						</p>
						{user.value && (
							<>
								<p>
									User: {user.value.first_name} {user.value.last_name}
								</p>
								<p>ID: {user.value.id}</p>
								{user.value.username && <p>@{user.value.username}</p>}
								{user.value.is_premium && (
									<span class="badge badge-warning badge-sm">Premium</span>
								)}
							</>
						)}
					</div>
				</div>

				{/* Reactive State */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-2">Reactive State</h2>
					<div class="text-sm space-y-1">
						<p>
							Viewport: {state.viewportWidth.value}x{state.viewportHeight.value}
						</p>
						<p>Expanded: {state.isExpanded.value ? 'Yes' : 'No'}</p>
						<p>Fullscreen: {state.isFullscreen.value ? 'Yes' : 'No'}</p>
						<p>Visible: {state.isVisible.value ? 'Yes' : 'No'}</p>
						<p>
							Safe Area: T{state.safeArea.value.top} B
							{state.safeArea.value.bottom}
						</p>
					</div>
				</div>

				{/* Viewport Control */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Viewport</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={doExpand}>
							Expand
						</button>
						<button
							class="btn btn-sm btn-primary"
							onClick={doFullscreen}
							disabled={state.isFullscreen.value}
						>
							Fullscreen
						</button>
						<button
							class="btn btn-sm"
							onClick={doExitFullscreen}
							disabled={!state.isFullscreen.value}
						>
							Exit Fullscreen
						</button>
					</div>
				</div>

				{/* Behavior Control */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Behavior</h2>
					<div class="space-y-3">
						<label class="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								class="toggle toggle-sm"
								checked={closingConfirmation.value}
								onChange={toggleClosingConfirmation}
							/>
							<span class="text-sm">Closing Confirmation</span>
						</label>
						<label class="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								class="toggle toggle-sm"
								checked={swipeEnabled.value}
								onChange={toggleSwipe}
							/>
							<span class="text-sm">Swipe to Minimize</span>
						</label>
					</div>
				</div>

				{/* Buttons */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">TMA Buttons</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm btn-primary" onClick={setupMainBtn}>
							Show Main
						</button>
						<button class="btn btn-sm" onClick={hideMainBtn}>
							Hide Main
						</button>
						<button
							class="btn btn-sm btn-secondary"
							onClick={setupSecondaryBtn}
						>
							Show Secondary
						</button>
						<button class="btn btn-sm" onClick={hideSecondaryBtn}>
							Hide Secondary
						</button>
						<button class="btn btn-sm" onClick={showBackBtn}>
							Show Back
						</button>
						<button class="btn btn-sm" onClick={showSettingsBtn}>
							Show Settings
						</button>
						<button class="btn btn-sm" onClick={hideSettingsBtn}>
							Hide Settings
						</button>
					</div>
				</div>

				{/* Haptics */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Haptics</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={() => testHaptic('light')}>
							Light
						</button>
						<button class="btn btn-sm" onClick={() => testHaptic('medium')}>
							Medium
						</button>
						<button class="btn btn-sm" onClick={() => testHaptic('heavy')}>
							Heavy
						</button>
					</div>
				</div>

				{/* Theme Palette */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Theme Palette</h2>
					<p class="text-xs text-base-content/60 mb-3">
						Available as --tg-[key] CSS variables
					</p>
					<div class="grid grid-cols-2 gap-1 text-xs font-mono">
						{Object.entries(state.themeParams.value).map(([key, color]) => (
							<div key={key} class="flex items-center gap-2 py-1">
								<div
									class="w-5 h-5 rounded border border-base-300 shrink-0"
									style={{ backgroundColor: color || '#888' }}
								/>
								<span class="truncate text-base-content/70">{key}</span>
							</div>
						))}
					</div>
				</div>

				{/* Theme Control */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Theme Control</h2>
					<div class="space-y-2">
						<div class="flex flex-wrap gap-2">
							<span class="text-sm">Header:</span>
							<button class="btn btn-xs" onClick={() => setHeader('bg_color')}>
								Default
							</button>
							<button
								class="btn btn-xs"
								onClick={() => setHeader('secondary_bg_color')}
							>
								Secondary
							</button>
							<button
								class="btn btn-xs btn-primary"
								onClick={() => setHeader('#2481cc')}
							>
								#2481cc
							</button>
						</div>
						<div class="flex flex-wrap gap-2">
							<span class="text-sm">Bottom:</span>
							<button class="btn btn-xs" onClick={() => setBottom('#ffffff')}>
								#fff
							</button>
							<button class="btn btn-xs" onClick={() => setBottom('#000000')}>
								#000
							</button>
						</div>
					</div>
				</div>

				{/* Features */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Features</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={testQR}>
							Scan QR
						</button>
						<button class="btn btn-sm" onClick={() => closeQRScanner()}>
							Close QR
						</button>
						<button class="btn btn-sm" onClick={testClipboard}>
							Read Clipboard
						</button>
						<button class="btn btn-sm" onClick={testPopup}>
							Show Popup
						</button>
					</div>
				</div>

				{/* Links */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Links</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={testLink}>
							Open Link
						</button>
						<button class="btn btn-sm" onClick={testTgLink}>
							Open @durov
						</button>
					</div>
				</div>

				{/* Biometry */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Biometry</h2>
					<div class="text-sm mb-3 space-y-1">
						<p>Available: {biometry.available ? 'Yes' : 'No'}</p>
						{biometry.type && <p>Type: {biometry.type}</p>}
						<p>Access Granted: {biometry.accessGranted ? 'Yes' : 'No'}</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							class="btn btn-sm btn-primary"
							onClick={testBiometryAccess}
							disabled={!biometry.available || biometry.accessGranted}
						>
							Request Access
						</button>
						<button
							class="btn btn-sm btn-success"
							onClick={testBiometryAuth}
							disabled={!biometry.available || !biometry.accessGranted}
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

				{/* Permissions */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Permissions</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={testWriteAccess}>
							Request Write
						</button>
						<button class="btn btn-sm" onClick={testPhoneRequest}>
							Request Phone
						</button>
					</div>
				</div>

				{/* Data */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Data & Invoice</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm btn-warning" onClick={testSendData}>
							Send Data (closes)
						</button>
						<button class="btn btn-sm" onClick={testInlineQuery}>
							Inline Query
						</button>
						<button class="btn btn-sm" onClick={testInvoice}>
							Open Invoice
						</button>
					</div>
				</div>

				{/* Device Sensors */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Device Sensors</h2>
					<div class="space-y-3">
						<div>
							<div class="flex items-center gap-2 mb-2">
								<button
									class={[
										'btn btn-sm',
										accelRunning.value ? 'btn-error' : 'btn-primary',
									]}
									onClick={toggleAccelerometer}
								>
									{accelRunning.value ? 'Stop' : 'Start'} Accelerometer
								</button>
							</div>
							{accelData.value && (
								<div class="text-xs font-mono bg-base-300 p-2 rounded">
									X: {accelData.value.x.toFixed(3)} Y:{' '}
									{accelData.value.y.toFixed(3)} Z:{' '}
									{accelData.value.z.toFixed(3)}
								</div>
							)}
						</div>
						<div>
							<div class="flex items-center gap-2 mb-2">
								<button
									class={[
										'btn btn-sm',
										gyroRunning.value ? 'btn-error' : 'btn-primary',
									]}
									onClick={toggleGyroscope}
								>
									{gyroRunning.value ? 'Stop' : 'Start'} Gyroscope
								</button>
							</div>
							{gyroData.value && (
								<div class="text-xs font-mono bg-base-300 p-2 rounded">
									X: {gyroData.value.x.toFixed(3)} Y:{' '}
									{gyroData.value.y.toFixed(3)} Z: {gyroData.value.z.toFixed(3)}
								</div>
							)}
						</div>
						<div>
							<div class="flex items-center gap-2 mb-2">
								<button
									class={[
										'btn btn-sm',
										orientRunning.value ? 'btn-error' : 'btn-primary',
									]}
									onClick={toggleOrientation}
								>
									{orientRunning.value ? 'Stop' : 'Start'} Orientation
								</button>
							</div>
							{orientData.value && (
								<div class="text-xs font-mono bg-base-300 p-2 rounded">
									α: {orientData.value.alpha.toFixed(1)}° β:{' '}
									{orientData.value.beta.toFixed(1)}° γ:{' '}
									{orientData.value.gamma.toFixed(1)}°
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Location */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Location</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm btn-primary" onClick={testLocation}>
							Request Location
						</button>
						<button class="btn btn-sm" onClick={() => openLocationSettings()}>
							Location Settings
						</button>
					</div>
				</div>

				{/* Home Screen */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Home Screen</h2>
					{homeScreenStatus.value && (
						<p class="text-sm mb-2">
							Status:{' '}
							<span class="badge badge-sm">{homeScreenStatus.value}</span>
						</p>
					)}
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm" onClick={testCheckHomeScreen}>
							Check Status
						</button>
						<button
							class="btn btn-sm btn-primary"
							onClick={testAddToHomeScreen}
						>
							Add to Home
						</button>
					</div>
				</div>

				{/* Share & Emoji */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Share & Emoji Status</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm btn-primary" onClick={testShareStory}>
							Share to Story
						</button>
						<button class="btn btn-sm" onClick={testEmojiStatus}>
							Set Emoji Status
						</button>
					</div>
				</div>

				{/* File Download */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">File Download</h2>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm btn-primary" onClick={testDownload}>
							Download Test File
						</button>
					</div>
				</div>

				{/* Cloud Storage */}
				<div class="card bg-base-200 p-4">
					<h2 class="font-semibold mb-3">Cloud Storage</h2>
					<div class="space-y-3">
						<div class="flex gap-2">
							<input
								type="text"
								class="input input-sm input-bordered flex-1"
								placeholder="Key"
								value={storageKey.value}
								onInput={(e) => {
									storageKey.value = (e.target as HTMLInputElement).value;
								}}
							/>
						</div>
						{storageValue.value && (
							<p class="text-sm">
								Value: <span class="badge badge-sm">{storageValue.value}</span>
							</p>
						)}
						<div class="flex flex-wrap gap-2">
							<button class="btn btn-sm btn-success" onClick={testStorageSave}>
								Save
							</button>
							<button class="btn btn-sm btn-primary" onClick={testStorageLoad}>
								Load
							</button>
							<button class="btn btn-sm btn-error" onClick={testStorageDelete}>
								Delete
							</button>
							<button class="btn btn-sm" onClick={testStorageKeys}>
								List Keys
							</button>
						</div>
					</div>
				</div>

				{/* Log */}
				<div class="card bg-base-300 p-4">
					<h2 class="font-semibold mb-2">Log</h2>
					<div class="text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
						{log.value.length === 0 ? (
							<p class="text-base-content/50">No events yet...</p>
						) : (
							log.value.map((entry, i) => <p key={i}>{entry}</p>)
						)}
					</div>
				</div>
			</div>
		);
	},
});
