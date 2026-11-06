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

    // 3. Dynamically copy ONLY .webp images from public folder
    const publicDir = path.join(__dirname, 'public');
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      let copiedCount = 0;

      files.forEach((file) => {
        if (file.endsWith('.webp')) {
          const source = path.join(publicDir, file);
          const dest = path.join(outputDir, file);
          
          fs.copyFileSync(source, dest);
          copiedCount++;
        }
      });
      
      console.log(`✅ Copied ${copiedCount} .webp images to dist-extension`);
    } else {
      console.warn(`⚠️ Warning: public directory not found. Images won't be copied.`);
    }
  }
});

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  publicDir: false, // <-- ADDED THIS LINE: Stops Vite from copying the whole public folder
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