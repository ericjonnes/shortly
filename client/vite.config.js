import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  //any request from React dev server that starts w/ /api get forwarded to Express server on port 3000
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
})
