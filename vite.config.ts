import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
