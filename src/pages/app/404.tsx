import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import HomeIcon from '@/assets/icons/home.svg?component';
import SearchOffIcon from '@/assets/icons/search-off.svg?component';
import { messages, useI18n } from '@/core/i18n';

export default defineComponent({
	name: 'NotFoundPage',
	setup() {
		const router = useRouter();
		const { t } = useI18n();

		return () => (
			<div class="hero min-h-screen bg-base-200">
				<div class="hero-content text-center">
					<div class="max-w-md">
						<div class="flex justify-center mb-6">
							<SearchOffIcon class="h-24 w-24 text-base-content/20" />
						</div>
						<h1 class="text-8xl font-bold text-primary">404</h1>
						<p class="py-6 text-xl text-base-content/70">
							{t(messages.pages.notFound.title)}
						</p>
						<button
							class="btn btn-primary gap-2"
							onClick={() => router.push('/')}
						>
							<HomeIcon class="h-5 w-5" />
							{t(messages.common.goHome)}
						</button>
					</div>
				</div>
			</div>
		);
	},
});
