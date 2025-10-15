import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: false,
    // safer defaults for low-memory builds
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      treeshake: true,
    },
  },
})
