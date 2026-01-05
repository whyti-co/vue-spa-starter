import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import CheckIcon from '@/assets/icons/check.svg?component';
import CogIcon from '@/assets/icons/cog.svg?component';
import WarningIcon from '@/assets/icons/warning.svg?component';
import Avatar from '@/components/Avatar';
import { TopBarTitle } from '@/components/layouts';
import PageWrapper from '@/components/PageWrapper';
import { messages, useI18n } from '@/core/i18n';
import { steps, useModal } from '@/core/modal';
import { useSession } from '@/core/session';
import { useAuth } from '@/domains/auth';

export default defineComponent({
	name: 'ProfilePage',
	setup() {
		const router = useRouter();
		const session = useSession();
		const { open } = useModal();
		const { logout } = useAuth();
		const { t } = useI18n();

		async function handleLogout() {
			await logout();
			router.push('/');
		}

		async function handleVerify() {
			steps.set([
				{
					id: 'info',
					path: '/verify-identity/step1',
					label: t(messages.modals.verifyIdentity.personalInfo),
				},
				{
					id: 'docs',
					path: '/verify-identity/step2',
					label: t(messages.modals.verifyIdentity.documents),
				},
			]);

			await open<{ success: boolean }>('/verify-identity/step1');
		}

		return () => (
			<PageWrapper
				layout={{
					topBar: {
						visible: true,
						title: () => (
							<TopBarTitle title={t(messages.pages.profile.title)} />
						),
						left: { icon: CogIcon, to: '/profile/settings' },
					},
				}}
			>
				<div class="space-y-6">
					<div class="card bg-base-200">
						<div class="card-body">
							<h2 class="card-title">
								{t(messages.pages.profile.accountInfo)}
							</h2>
							{session.isAuthenticated ? (
								<div class="flex items-center gap-4">
									<Avatar
										letter={session.user?.name?.[0]}
										size="lg"
										variant="primary"
									/>
									<div class="space-y-1">
										<p class="font-semibold text-lg">{session.user?.name}</p>
										<p class="text-base-content/70">{session.user?.email}</p>
									</div>
								</div>
							) : (
								<div class="flex items-center gap-4">
									<div class="skeleton w-16 h-16 rounded-full" />
									<div class="space-y-2">
										<div class="skeleton h-4 w-32" />
										<div class="skeleton h-3 w-48" />
									</div>
								</div>
							)}
						</div>
					</div>

					<div class="card bg-base-200">
						<div class="card-body">
							<h2 class="card-title">
								{t(messages.pages.profile.verificationStatus)}
							</h2>

							{session.isVerified ? (
								<div class="space-y-3">
									<div class="badge badge-success gap-1">
										<CheckIcon class="h-4 w-4" />
										{t(messages.common.verified)}
									</div>
									<div class="grid gap-2 text-sm">
										<div class="flex justify-between">
											<span class="text-base-content/70">
												{t(messages.common.fullName)}
											</span>
											<span class="font-medium">
												{session.user?.verification?.fullName}
											</span>
										</div>
										<div class="divider my-0" />
										<div class="flex justify-between">
											<span class="text-base-content/70">
												{t(messages.common.document)}
											</span>
											<span class="font-medium">
												{session.user?.verification?.documentType}
											</span>
										</div>
										<div class="divider my-0" />
										<div class="flex justify-between">
											<span class="text-base-content/70">
												{t(messages.common.verified)}
											</span>
											<span class="font-medium">
												{session.user?.verification?.verifiedAt}
											</span>
										</div>
									</div>
								</div>
							) : (
								<div class="flex items-center justify-between">
									<div class="badge badge-warning gap-1">
										<WarningIcon class="h-4 w-4" />
										{t(messages.common.notVerified)}
									</div>
									{session.isAuthenticated && (
										<button
											class="btn btn-primary btn-sm"
											onClick={handleVerify}
										>
											{t(messages.pages.profile.verifyNow)}
										</button>
									)}
								</div>
							)}
						</div>
					</div>

					{session.isAuthenticated && (
						<button
							class="btn btn-outline btn-error w-full"
							onClick={handleLogout}
						>
							{t(messages.common.logout)}
						</button>
					)}
				</div>
			</PageWrapper>
		);
	},
});
