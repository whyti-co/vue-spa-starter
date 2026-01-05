/**
 * Example Plugin - exports.ts
 *
 * Lazy-loaded on first usePlugin('example') call.
 * Put heavy code here: composables, components, utilities.
 *
 * IMPORTANT: Use markRaw() on components to prevent Vue reactivity warnings.
 */
import { markRaw } from 'vue';
import Counter from './components/Counter';
import { useCounter } from './composables/useCounter';

export type TExampleExports = {
	useCounter: typeof useCounter;
	Counter: typeof Counter;
};

const exports: TExampleExports = {
	useCounter,
	Counter: markRaw(Counter),
};

export default exports;
