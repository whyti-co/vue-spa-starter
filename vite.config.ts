import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';
import tsconfigPaths from 'vite-tsconfig-paths';
import { treeShakePlugins } from './vite-plugins';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		tailwindcss(),
		vueDevTools(),
		svgLoader({ defaultImport: 'component' }),
		tsconfigPaths(),
		treeShakePlugins(),
	],
});
