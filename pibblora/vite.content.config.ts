import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  build: {
    outDir: 'dist-extension',
    emptyOutDir: false,
    lib: { entry: path.resolve(__dirname, 'extension/content.ts'), name: 'PibbloraContent', formats: ['iife'], fileName: () => 'content.js' },
    minify: 'esbuild'
  }
});