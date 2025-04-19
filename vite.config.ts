import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: false,
    watch: {
      usePolling: true
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true
  }
})
