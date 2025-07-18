import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/apis': {
        target: 'https://apis.ccbp.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/apis/, ''),
      },
    },
  },
})