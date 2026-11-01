import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const copyExtensionFiles = () => ({
  name: 'copy-extension-files',
  closeBundle() {
    const outputDir = 'dist-extension';
    const iconSource = 'extension/icons';
    const iconOutput = path.join(outputDir, 'icons');

    // 1. Copy Manifest
    fs.copyFileSync(
      'extension/manifest.json',
      path.join(outputDir, 'manifest.json')
    );

    // 2. Copy Icons
    fs.mkdirSync(iconOutput, { recursive: true });
    for (const file of ['icon-16.png', 'icon-48.png', 'icon-128.png']) {
      const source = path.join(iconSource, file);
      if (!fs.existsSync(source)) {
        throw new Error(`Missing extension icon: ${source}`);
      }
      fs.copyFileSync(source, path.join(iconOutput, file));
    }

    // 3. Copy spider.png for web_accessible_resources
    const spiderSource = 'public/spider.png';
    const spiderDest = path.join(outputDir, 'spider.png');
    
    if (fs.existsSync(spiderSource)) {
      fs.copyFileSync(spiderSource, spiderDest);
      console.log('✅ Copied spider.png to dist-extension');
    } else {
      console.warn('⚠️ Warning: public/spider.png not found. The extension spiderman pet may not load.');
    }
  }
});

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist-extension',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        newtab: path.resolve(__dirname, 'newtab.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});