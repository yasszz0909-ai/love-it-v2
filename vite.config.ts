import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyStaticRuntimeDirs(): Plugin {
  return {
    name: 'copy-static-runtime-dirs',
    closeBundle() {
      const root = path.resolve(__dirname);
      const dist = path.resolve(__dirname, 'dist');
      copyDir(path.join(root, 'js'), path.join(dist, 'js'));
      copyDir(path.join(root, 'css'), path.join(dist, 'css'));
      copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
      console.log('✅ [Vite Plugin] Successfully copied js, css, and assets to dist directory for production!');
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyStaticRuntimeDirs()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          pesan: path.resolve(__dirname, 'pesan.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
