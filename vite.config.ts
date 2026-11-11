import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'three-world', test: /node_modules[\\/](three|@react-three[\\/](fiber|drei))[\\/]/, priority: 20 },
            { name: 'motion-ui', test: /node_modules[\\/]framer-motion[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
});
