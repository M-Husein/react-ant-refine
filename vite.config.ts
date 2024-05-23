import { defineConfig } from 'vite';
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
// import { VitePWA } from 'vite-plugin-pwa';
// import mkcert from 'vite-plugin-mkcert';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // mkcert(),

    // VitePWA({
    //   registerType: 'autoUpdate', // @default 'prompt'
    //   devOptions: {
    //     enabled: true
    //   },
    //   outDir: './public', // @default 'dist'
    //   manifestFilename: 'manifest.json', // @default 'manifest.webmanifest'
    //   manifest: {
    //     name: "MYCO", // @default _npm_package_name_
    //     short_name: "MYCO", // @default _npm_package_name_
    //     description: "Budget Planning & Financial Consolidation Software", // @default _npm_package_description_
    //     background_color: "#ffffff", // @default `#ffffff`
    //     theme_color: "#f5f5f5", // @default '#42b883
    //     scope: "./",
    //     icons: [
    //       {
    //         sizes: "32x32",
    //         src: "logo-32x32.png",
    //         type: "image/png"
    //       },
    //       {
    //         sizes: "180x180",
    //         src: "logo-180x180.png",
    //         type: "image/png"
    //       },
    //     ], 
    //   },
    // }),
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
