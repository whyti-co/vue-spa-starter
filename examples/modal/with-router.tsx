/**
 * Modal with Router Example
 *
 * Self-contained multi-step wizard with its own router and step components.
 */

import { computed, defineComponent, h, ref, watch } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import Modal from '@/components/Modal';
import Stepper from '@/components/Stepper';
import { useQueue } from '@/core/composables/useQueue';

// Step 1 Component
const Step1 = defineComponent({
	name: 'Step1',
	props: {
		onNext: { type: Function, required: true },
		onClose: { type: Function, required: true },
	},
	setup(props) {
		return () => (
			<div class="space-y-4">
				<h2 class="text-xl font-bold">Personal Info</h2>
				<p class="text-base-content/70">Enter your details to continue.</p>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Full Name</span>
					</label>
					<input
						type="text"
						class="input input-bordered"
						placeholder="John Doe"
					/>
				</div>
				<div class="modal-action">
					<button class="btn" onClick={() => props.onClose()}>
						Cancel
					</button>
					<button class="btn btn-primary" onClick={() => props.onNext()}>
						Continue
					</button>
				</div>
			</div>
		);
	},
});

// Step 2 Component
const Step2 = defineComponent({
	name: 'Step2',
	props: {
		onNext: { type: Function, required: true },
		onPrev: { type: Function, required: true },
	},
	setup(props) {
		return () => (
			<div class="space-y-4">
				<h2 class="text-xl font-bold">Document Upload</h2>
				<p class="text-base-content/70">Upload a photo of your ID.</p>
				<div class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
					<p class="text-base-content/50">Click or drag to upload</p>
				</div>
				<div class="modal-action">
					<button class="btn" onClick={() => props.onPrev()}>
						Back
					</button>
					<button class="btn btn-primary" onClick={() => props.onNext()}>
						Continue
					</button>
				</div>
			</div>
		);
	},
});

// Step 3 Component
const Step3 = defineComponent({
	name: 'Step3',
	props: {
		onPrev: { type: Function, required: true },
		onComplete: { type: Function, required: true },
	},
	setup(props) {
		return () => (
			<div class="space-y-4">
				<h2 class="text-xl font-bold">Review</h2>
				<p class="text-base-content/70">
					Review your information before submitting.
				</p>
				<div class="bg-base-200 p-4 rounded-lg">
					<p>Name: John Doe</p>
					<p>Document: ID uploaded</p>
				</div>
				<div class="modal-action">
					<button class="btn" onClick={() => props.onPrev()}>
						Back
					</button>
					<button class="btn btn-primary" onClick={() => props.onComplete()}>
						Complete
					</button>
				</div>
			</div>
		);
	},
});

// Main Example Component
export default defineComponent({
	name: 'ModalWithRouterExample',
	setup() {
		const isOpen = ref(false);
		const result = ref<{ success: boolean } | null>(null);

		// Steps queue
		type TStep = { id: string; path: string; label: string };
		const steps = useQueue<TStep>();

		// Modal router
		const modalRouter = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/', component: { render: () => null } },
				{ path: '/step1', component: Step1 },
				{ path: '/step2', component: Step2 },
				{ path: '/step3', component: Step3 },
			],
		});

		// Sync steps with router
		watch(
			() => steps.current.value,
			(step) => {
				if (step && modalRouter.currentRoute.value.path !== step.path) {
					modalRouter.push(step.path);
				}
			},
		);

		// Current route component
		const currentComponent = computed(() => {
			const matched = modalRouter.currentRoute.value.matched;
			const last = matched[matched.length - 1];
			return last?.components?.default ?? null;
		});

		function openWizard() {
			steps.set([
				{ id: 'info', path: '/step1', label: 'Personal Info' },
				{ id: 'docs', path: '/step2', label: 'Documents' },
				{ id: 'review', path: '/step3', label: 'Review' },
			]);
			modalRouter.push('/step1');
			isOpen.value = true;
		}

		function closeModal(success = false) {
			result.value = { success };
			isOpen.value = false;
			modalRouter.push('/');
			steps.set([]);
		}

		return () => (
			<div class="p-8 space-y-4">
				<h1 class="text-2xl font-bold">Modal with Router</h1>

				<button class="btn btn-primary" onClick={openWizard}>
					Start Wizard
				</button>

				{result.value && (
					<div
						class={[
							'alert',
							result.value.success ? 'alert-success' : 'alert-warning',
						]}
					>
						{result.value.success ? 'Completed successfully!' : 'Cancelled'}
					</div>
				)}

				<Modal open={isOpen.value} onClose={() => closeModal()}>
					{steps.items.value.length > 1 && (
						<Stepper
							items={steps.items.value}
							currentIndex={steps.currentIndex.value}
						/>
					)}
					{currentComponent.value &&
						h(currentComponent.value as any, {
							onNext: steps.next,
							onPrev: steps.prev,
							onClose: () => closeModal(),
							onComplete: () => closeModal(true),
						})}
				</Modal>
			</div>
		);
	},
});
