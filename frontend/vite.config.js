import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all addresses including LAN
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 443, // Use HTTPS port for HMR over ngrok
    },
    allowedHosts: [
      '.ngrok-free.app',    // Allow all ngrok free domains
      '.ngrok.io',          // Allow all ngrok paid domains
      'localhost',          // Allow localhost
      '127.0.0.1',          // Allow local IP
    ],
  },
})
