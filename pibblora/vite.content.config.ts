import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'dist-extension',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'extension/content/index.ts'),
      name: 'PibbloraContent',
      formats: ['iife'], fileName: () => 'content.js'
    },
    minify: 'esbuild'
  }
});