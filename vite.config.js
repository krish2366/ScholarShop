import { defineConfig, loadEnv } from 'vite' // Add loadEnv
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load env variables
  return {
    plugins: [react()],
    server: {
      proxy: {
        // Use a generic proxy path like '/api' for all backend calls
        '/api': {
          target: env.VITE_MAIN_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    }
  }
})