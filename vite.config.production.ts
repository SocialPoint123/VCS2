import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'client/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'client/index.html',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './client/src/assets'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  esbuild: {
    target: 'es2020',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});