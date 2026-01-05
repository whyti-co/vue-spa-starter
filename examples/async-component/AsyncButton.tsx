import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AsyncButton',
	setup() {
		return () => <button class="btn btn-primary">Async Loaded Button</button>;
	},
});
