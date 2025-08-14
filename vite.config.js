import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': '${import.meta.env.VITE_MAIN_BACKEND_URL}',
      '/auth/login': '${import.meta.env.VITE_MAIN_BACKEND_URL}',
      '/auth/signup': '${import.meta.env.VITE_MAIN_BACKEND_URL}',
      '/auth/google': '${import.meta.env.VITE_MAIN_BACKEND_URL}',
      '/auth/logout': '${import.meta.env.VITE_MAIN_BACKEND_URL}',
      '/api': '${import.meta.env.VITE_MAIN_BACKEND_URL}'
    }
  }
})
