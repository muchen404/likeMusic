import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'

const resolve = (dir: string) => join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/scss/variable.scss";@import "@/assets/scss/mixin.scss";',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:9002'
    }
  }
})