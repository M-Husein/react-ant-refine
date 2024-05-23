import { defineConfig } from 'vite';
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
// import mkcert from 'vite-plugin-mkcert';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // mkcert(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // port: 5127, // Default = 5173
    /** @DOCS : https://vitejs.dev/config/server-options.html#server-strictport */
    // strictPort: true, // Default = false
    // https: true,
    host: true,
  },
  build: {
    minify: 'terser',
    // sourcemap: false,
    // reportCompressedSize: false, // For fast build
    
    // outDir: './public',
    // emptyOutDir: false,
    // rollupOptions: {
    //   input: '/index.html',
    //   // DEV
    //   // https://vitejs.dev/guide/build#multi-page-app
    //   // input: {
    //   //   main: path.resolve(__dirname, 'index.html'),
    //   //   // Any nested folder (For SSG)
    //   //   nested: path.resolve(__dirname, 'nested/index.html'),
    //   // },
    // },
  },
});
