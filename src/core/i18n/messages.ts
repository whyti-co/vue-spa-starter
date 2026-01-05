import { defineMessages } from '@formatjs/intl';

export const messages = {
	actions: defineMessages({
		cancel: { id: 'actions.cancel', defaultMessage: 'Cancel' },
		continue: { id: 'actions.continue', defaultMessage: 'Continue' },
		back: { id: 'actions.back', defaultMessage: 'Back' },
		complete: { id: 'actions.complete', defaultMessage: 'Complete' },
		submit: { id: 'actions.submit', defaultMessage: 'Submit' },
		save: { id: 'actions.save', defaultMessage: 'Save' },
		delete: { id: 'actions.delete', defaultMessage: 'Delete' },
		edit: { id: 'actions.edit', defaultMessage: 'Edit' },
		close: { id: 'actions.close', defaultMessage: 'Close' },
	}),
	common: defineMessages({
		email: { id: 'common.email', defaultMessage: 'Email' },
		name: { id: 'common.name', defaultMessage: 'Name' },
		fullName: { id: 'common.fullName', defaultMessage: 'Full Name' },
		document: { id: 'common.document', defaultMessage: 'Document' },
		verified: { id: 'common.verified', defaultMessage: 'Verified' },
		notVerified: { id: 'common.notVerified', defaultMessage: 'Not verified' },
		settings: { id: 'common.settings', defaultMessage: 'Settings' },
		logout: { id: 'common.logout', defaultMessage: 'Logout' },
		goHome: { id: 'common.goHome', defaultMessage: 'Go Home' },
	}),
	pages: {
		home: defineMessages({
			title: { id: 'pages.home.title', defaultMessage: 'Home' },
		}),
		profile: defineMessages({
			title: { id: 'pages.profile.title', defaultMessage: 'Profile' },
			accountInfo: {
				id: 'pages.profile.accountInfo',
				defaultMessage: 'Account Info',
			},
			verificationStatus: {
				id: 'pages.profile.verificationStatus',
				defaultMessage: 'Verification Status',
			},
			verifyNow: {
				id: 'pages.profile.verifyNow',
				defaultMessage: 'Verify Now',
			},
		}),
		settings: defineMessages({
			title: { id: 'pages.settings.title', defaultMessage: 'Settings' },
			appearance: {
				id: 'pages.settings.appearance',
				defaultMessage: 'Appearance',
			},
			darkMode: { id: 'pages.settings.darkMode', defaultMessage: 'Dark Mode' },
			language: { id: 'pages.settings.language', defaultMessage: 'Language' },
		}),
		notFound: defineMessages({
			title: { id: 'pages.notFound.title', defaultMessage: 'Page not found' },
		}),
	},
	modals: {
		login: defineMessages({
			title: { id: 'modals.login.title', defaultMessage: 'Sign In' },
			description: {
				id: 'modals.login.description',
				defaultMessage: 'Sign in to view your profile',
			},
		}),
		verifyIdentity: defineMessages({
			personalInfo: {
				id: 'modals.verifyIdentity.personalInfo',
				defaultMessage: 'Personal Info',
			},
			personalInfoDescription: {
				id: 'modals.verifyIdentity.personalInfoDescription',
				defaultMessage:
					'Enter your personal information to begin verification.',
			},
			dateOfBirth: {
				id: 'modals.verifyIdentity.dateOfBirth',
				defaultMessage: 'Date of Birth',
			},
			documents: {
				id: 'modals.verifyIdentity.documents',
				defaultMessage: 'Documents',
			},
			documentUpload: {
				id: 'modals.verifyIdentity.documentUpload',
				defaultMessage: 'Document Upload',
			},
			documentUploadDescription: {
				id: 'modals.verifyIdentity.documentUploadDescription',
				defaultMessage: 'Upload a photo of your ID document.',
			},
			clickOrDrag: {
				id: 'modals.verifyIdentity.clickOrDrag',
				defaultMessage: 'Click or drag to upload',
			},
			fileLimit: {
				id: 'modals.verifyIdentity.fileLimit',
				defaultMessage: 'PNG, JPG up to 10MB',
			},
		}),
	},
	examples: defineMessages({
		greeting: { id: 'examples.greeting', defaultMessage: 'Hello, {name}!' },
		items: {
			id: 'examples.items',
			defaultMessage:
				'You have {count, plural, =0 {no items} one {# item} other {# items}}.',
		},
		price: {
			id: 'examples.price',
			defaultMessage: 'Total: {amount, number, ::currency/USD}',
		},
		today: {
			id: 'examples.today',
			defaultMessage: 'Today is {date, date, long}',
		},
	}),
};
