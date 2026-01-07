import { defineComponent } from 'vue';
import ModalWrapper from '@/components/ModalWrapper';
import { messages, useI18n } from '@/core/i18n';
import { modalRouter } from '@/core/modal';

export default defineComponent({
	name: 'TosModal',
	setup() {
		const { t } = useI18n();

		return () => (
			<ModalWrapper>
				<div class="prose prose-sm max-w-none">
					<h2>Terms of Service</h2>
					<p>Last updated: January 2025</p>

					<h3>1. Acceptance of Terms</h3>
					<p>
						By accessing and using this application, you accept and agree to be
						bound by the terms and provision of this agreement. Additionally,
						when using this application's particular services, you shall be
						subject to any posted guidelines or rules applicable to such
						services.
					</p>

					<h3>2. Description of Service</h3>
					<p>
						This application provides users with access to a collection of
						resources, including various communications tools, forums, shopping
						services, personalized content, and branded programming through its
						network of properties.
					</p>

					<h3>3. User Conduct</h3>
					<p>
						You agree to use this application only for lawful purposes. You are
						prohibited from posting on or transmitting through this application
						any material that violates or infringes the rights of others, or
						that is threatening, abusive, defamatory, invasive of privacy or
						publicity rights, vulgar, obscene, profane, or otherwise
						objectionable.
					</p>

					<h3>4. Privacy Policy</h3>
					<p>
						Your use of this application is also governed by our Privacy Policy.
						Please review our Privacy Policy, which also governs the application
						and informs users of our data collection practices.
					</p>

					<h3>5. Disclaimer of Warranties</h3>
					<p>
						This application and its components are offered for informational
						purposes only; this application shall not be responsible or liable
						for the accuracy, usefulness, or availability of any information
						transmitted or made available via the application.
					</p>

					<h3>6. Limitation of Liability</h3>
					<p>
						In no event shall this application or its suppliers be liable for
						any damages (including, without limitation, damages for loss of data
						or profit, or due to business interruption) arising out of the use
						or inability to use the materials on this application.
					</p>

					<h3>7. Changes to Terms</h3>
					<p>
						We reserve the right to modify these terms at any time. We do so by
						posting and drawing attention to the updated terms on the
						application. Your decision to continue to visit and make use of the
						application after such changes have been made constitutes your
						formal acceptance of the new Terms of Service.
					</p>

					<h3>8. Contact Information</h3>
					<p>
						If you have any questions about these Terms, please contact us at
						support@example.com.
					</p>
				</div>
				<div class="sticky bottom-0 py-4">
					<button
						type="button"
						class="btn btn-primary w-full shadow-[0_0_2rem_1rem_var(--color-base-100)]"
						onClick={() => modalRouter.back()}
					>
						{t(messages.actions.agree)}
					</button>
				</div>
			</ModalWrapper>
		);
	},
});
