import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request to /api or /chat gets forwarded to the Express backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
