import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // or react-swc, svelte, etc.

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})