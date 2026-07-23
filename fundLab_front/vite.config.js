import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    watch: {
      // Ignore folders with special characters in filenames (spaces, commas) that crash the Node watcher on Windows
      ignored: ['**/src/assets/icone diagnostique/**']
    }
  }
})
