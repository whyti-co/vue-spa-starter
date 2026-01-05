import { defineComponent } from 'vue';

export default defineComponent({
	name: 'TopBarTitle',
	props: {
		title: { type: String, required: true },
	},
	setup(props) {
		return () => <span class="text-lg font-semibold">{props.title}</span>;
	},
});
