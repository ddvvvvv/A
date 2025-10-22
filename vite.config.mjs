import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: 'A',
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 正确声明别名
    },
  },
})
