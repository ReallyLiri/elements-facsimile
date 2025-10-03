import { defineConfig } from 'vite'
import { resolve } from 'path'
import { injectDataPlugin } from './vite-plugin-inject-data.js'

export default defineConfig({
  base: '/elements-facsimile/',
  plugins: [injectDataPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        diagrams: resolve(__dirname, 'diagrams.html')
      }
    }
  }
})