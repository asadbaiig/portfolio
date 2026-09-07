import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'app',
  resolve: { alias: { '/src': fileURLToPath(new URL('./src', import.meta.url)) } },
  publicDir: '../public',
  plugins: [react()],
  base: '/portfolio/',
  build: { outDir: '../dist', emptyOutDir: true }
});
