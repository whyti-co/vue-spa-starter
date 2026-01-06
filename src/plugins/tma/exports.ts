/**
 * TMA Plugin Exports
 *
 * All heavy TMA functionality is exported here and lazy-loaded.
 */
export * from './bridge';

import {
	addToHomeScreen,
	authenticateWithBiometry,
	checkHomeScreen,
	close,
	closeQRScanner,
	cloudStorageDelete,
	cloudStorageGet,
	cloudStorageGetMany,
	cloudStorageKeys,
	cloudStorageSet,
	downloadFile,
	exitFullscreen,
	expand,
	getEnvironment,
	getLaunchParams,
	getPlatform,
	getStartParam,
	getThemeParams,
	getUser,
	getVersion,
	hapticFeedback,
	hideMainButton,
	initTMA,
	isTMA,
	isVersionAtLeast,
	onAccelerometerChange,
	onBackButtonClick,
	onDeviceOrientationChange,
	onGyroscopeChange,
	onMainButtonClick,
	onSecondaryButtonClick,
	onSettingsButtonClick,
	openBiometrySettings,
	openInvoice,
	openLink,
	openLocationSettings,
	openTelegramLink,
	readClipboard,
	requestBiometryAccess,
	requestBiometryInfo,
	requestEmojiStatusAccess,
	requestFullscreen,
	requestLocation,
	requestPhone,
	requestWriteAccess,
	scanQR,
	sendData,
	sendPreparedMessage,
	setBackButtonVisible,
	setBackgroundColor,
	setBottomBarColor,
	setClosingConfirmation,
	setEmojiStatus,
	setHeaderColor,
	setSettingsButtonVisible,
	setSwipeEnabled,
	setupMainButton,
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
	syncThemeToCSSVariables,
	toggleFullscreen,
	updateBiometryToken,
} from './bridge';

export type TTmaExports = {
	isTMA: typeof isTMA;
	getEnvironment: typeof getEnvironment;
	initTMA: typeof initTMA;
	state: typeof state;
	getLaunchParams: typeof getLaunchParams;
	getUser: typeof getUser;
	getVersion: typeof getVersion;
	getPlatform: typeof getPlatform;
	getStartParam: typeof getStartParam;
	getThemeParams: typeof getThemeParams;
	isVersionAtLeast: typeof isVersionAtLeast;
	syncThemeToCSSVariables: typeof syncThemeToCSSVariables;
	setHeaderColor: typeof setHeaderColor;
	setBackgroundColor: typeof setBackgroundColor;
	setBottomBarColor: typeof setBottomBarColor;
	expand: typeof expand;
	close: typeof close;
	requestFullscreen: typeof requestFullscreen;
	exitFullscreen: typeof exitFullscreen;
	toggleFullscreen: typeof toggleFullscreen;
	setClosingConfirmation: typeof setClosingConfirmation;
	setSwipeEnabled: typeof setSwipeEnabled;
	setBackButtonVisible: typeof setBackButtonVisible;
	hapticFeedback: typeof hapticFeedback;
	openLink: typeof openLink;
	openTelegramLink: typeof openTelegramLink;
	showPopup: typeof showPopup;
	requestBiometryInfo: typeof requestBiometryInfo;
	requestBiometryAccess: typeof requestBiometryAccess;
	authenticateWithBiometry: typeof authenticateWithBiometry;
	updateBiometryToken: typeof updateBiometryToken;
	openBiometrySettings: typeof openBiometrySettings;
	setupMainButton: typeof setupMainButton;
	showMainButton: typeof showMainButton;
	hideMainButton: typeof hideMainButton;
	onMainButtonClick: typeof onMainButtonClick;
	setupSecondaryButton: typeof setupSecondaryButton;
	onSecondaryButtonClick: typeof onSecondaryButtonClick;
	setSettingsButtonVisible: typeof setSettingsButtonVisible;
	onSettingsButtonClick: typeof onSettingsButtonClick;
	onBackButtonClick: typeof onBackButtonClick;
	scanQR: typeof scanQR;
	closeQRScanner: typeof closeQRScanner;
	readClipboard: typeof readClipboard;
	openInvoice: typeof openInvoice;
	requestWriteAccess: typeof requestWriteAccess;
	requestPhone: typeof requestPhone;
	sendData: typeof sendData;
	switchInlineQuery: typeof switchInlineQuery;
	startAccelerometer: typeof startAccelerometer;
	stopAccelerometer: typeof stopAccelerometer;
	onAccelerometerChange: typeof onAccelerometerChange;
	startGyroscope: typeof startGyroscope;
	stopGyroscope: typeof stopGyroscope;
	onGyroscopeChange: typeof onGyroscopeChange;
	startDeviceOrientation: typeof startDeviceOrientation;
	stopDeviceOrientation: typeof stopDeviceOrientation;
	onDeviceOrientationChange: typeof onDeviceOrientationChange;
	requestLocation: typeof requestLocation;
	openLocationSettings: typeof openLocationSettings;
	addToHomeScreen: typeof addToHomeScreen;
	checkHomeScreen: typeof checkHomeScreen;
	shareToStory: typeof shareToStory;
	requestEmojiStatusAccess: typeof requestEmojiStatusAccess;
	setEmojiStatus: typeof setEmojiStatus;
	downloadFile: typeof downloadFile;
	sendPreparedMessage: typeof sendPreparedMessage;
	cloudStorageSet: typeof cloudStorageSet;
	cloudStorageGet: typeof cloudStorageGet;
	cloudStorageGetMany: typeof cloudStorageGetMany;
	cloudStorageDelete: typeof cloudStorageDelete;
	cloudStorageKeys: typeof cloudStorageKeys;
};

export default {
	isTMA,
	getEnvironment,
	initTMA,
	state,
	getLaunchParams,
	getUser,
	getVersion,
	getPlatform,
	getStartParam,
	getThemeParams,
	isVersionAtLeast,
	syncThemeToCSSVariables,
	setHeaderColor,
	setBackgroundColor,
	setBottomBarColor,
	expand,
	close,
	requestFullscreen,
	exitFullscreen,
	toggleFullscreen,
	setClosingConfirmation,
	setSwipeEnabled,
	setBackButtonVisible,
	hapticFeedback,
	openLink,
	openTelegramLink,
	showPopup,
	requestBiometryInfo,
	requestBiometryAccess,
	authenticateWithBiometry,
	updateBiometryToken,
	openBiometrySettings,
	setupMainButton,
	showMainButton,
	hideMainButton,
	onMainButtonClick,
	setupSecondaryButton,
	onSecondaryButtonClick,
	setSettingsButtonVisible,
	onSettingsButtonClick,
	onBackButtonClick,
	scanQR,
	closeQRScanner,
	readClipboard,
	openInvoice,
	requestWriteAccess,
	requestPhone,
	sendData,
	switchInlineQuery,
	startAccelerometer,
	stopAccelerometer,
	onAccelerometerChange,
	startGyroscope,
	stopGyroscope,
	onGyroscopeChange,
	startDeviceOrientation,
	stopDeviceOrientation,
	onDeviceOrientationChange,
	requestLocation,
	openLocationSettings,
	addToHomeScreen,
	checkHomeScreen,
	shareToStory,
	requestEmojiStatusAccess,
	setEmojiStatus,
	downloadFile,
	sendPreparedMessage,
	cloudStorageSet,
	cloudStorageGet,
	cloudStorageGetMany,
	cloudStorageDelete,
	cloudStorageKeys,
} satisfies TTmaExports;
