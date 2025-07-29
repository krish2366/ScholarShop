import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': 'http://localhost:5000',
      '/auth/login': 'http://localhost:5000',
      '/auth/signup': 'http://localhost:5000',
      '/auth/google': 'http://localhost:5000',
      '/auth/logout': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
})
