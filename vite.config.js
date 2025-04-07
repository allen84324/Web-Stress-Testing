import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			'/start-test': 'http://localhost:3000', // 將 /start-test 請求代理到伺服器端
		},
	},
})
